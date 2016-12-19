import { momentFromString } from '../../entity/util/memoizedMoment';

export function realStatus(record, entityName, now) {
  let campaign;
  let adsquad;
  let ad;
  switch (entityName.single) {
    case 'campaign':
      campaign = record;
      break;
    case 'adsquad':
      adsquad = record;
      campaign = record.get('campaign');
      break;
    case 'ad':
      ad = record;
      adsquad = record.get('adsquad');
      if (!adsquad) {
        return record.get('status', 'ACTIVE');
      }
      campaign = adsquad.get('campaign');
      break;
    default:
      return record.get('status') || 'ACTIVE';
  }
  if (!campaign) {
    return null;
  }
  let status = campaign.get('status');
  let start_time;
  let end_time;
  if (status === 'ACTIVE') {
    start_time = campaign.get('start_time');
    if (start_time && momentFromString(start_time) > now) {
      return 'SCHEDULED';
    }
    end_time = campaign.get('end_time');
    if (end_time && momentFromString(end_time) < now) {
      return 'COMPLETED';
    }
  } else if (status === 'SCHEDULED') {
    return 'CAMPAIGN_SCHEDULED';
  } else if (status === 'COMPLETED') {
    return 'CAMPAIGN_COMPLETED';
  }
  if (!adsquad || (status === 'DELETED')) {
    return status;
  }
  if (status === 'PAUSED') {
    return 'CAMPAIGN_PAUSED';
  }
  status = adsquad.get('status');
  if (status === 'ACTIVE') {
    start_time = adsquad.get('start_time');
    if (start_time && momentFromString(start_time) > now) {
      return 'SCHEDULED';
    }
    end_time = adsquad.get('end_time');
    if (end_time && momentFromString(end_time) < now) {
      return 'COMPLETED';
    }
  } else if (status === 'SCHEDULED') {
    return 'ADSQUAD_SCHEDULED';
  } else if (status === 'COMPLETED') {
    return 'ADSQUAD_COMPLETED';
  } else if (status === 'CAMPAIGN_PAUSED') {
    return status;
  }
  if (!ad || (status === 'DELETED')) {
    return status;
  }
  if (status === 'PAUSED') {
    return 'ADSQUAD_PAUSED';
  }
  return ad.get('status');
}
