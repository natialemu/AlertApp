import { StyleSheet } from 'react-native';

// TODO:
// refactor to use  https://www.npmjs.com/package/react-native-extended-stylesheet

// Colors for future reference
// http://www.flatuicolorpicker.com/
// #F9690E -- ecstasy possible icon color
// #C0392B -- tall poppy possible header text color or icon color
// #96281B -- old brick possible header text color or icon color

// #2B2B2B -- off black for normal copy,
export const globals = {
  TITLE_FONT: 'Avenir-Black',
  BODY_FONT: 'Avenir-Book',
  FONT_SIZE_LARGE: 24,
  FONT_SIZE_MEDIUM: 18,
  FONT_SIZE_SMALL: 14,
  OFF_WHITE: '#ECECEC',
  BLACK: '#2B2B2B',
  GRAY: '#ABB7B7',
  LIGHT_GRAY: '#6C7A89',
  BURNT_ORANGE: '#D35400',
  ORANGE: '#F9690E',
  RED: '#C0392B',
};


export default StyleSheet.create({
  tabBar: {
    height: 70
  },
  container: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: globals.GRAY,
    marginTop: 20,
    padding: 10
  },
  specialContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: globals.GRAY,
    marginTop: 20,
    padding: 10
  },
  header: {
    fontFamily: globals.TITLE_FONT,
    fontSize: globals.FONT_SIZE_LARGE,
    fontWeight: 'bold',
    textAlign: 'center',
    color: globals.BURNT_ORANGE,
  },
  subHeader: {
    fontFamily: globals.TITLE_FONT,
    fontSize: globals.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
    textAlign: 'center',
    color: globals.BLACK,
  },
  bodyText: {
    fontFamily: globals.BODY_FONT,
    fontSize: globals.FONT_SIZE_SMALL,
    textAlign: 'center',
    color: globals.BLACK,
  },
  icon1: {
    fontFamily: globals.BODY_FONT,
    fontSize: globals.FONT_SIZE_SMALL,
    textAlign: 'center',
    color: globals.ORANGE,
  },
  icon2: {
    fontFamily: globals.BODY_FONT,
    fontSize: globals.FONT_SIZE_SMALL,
    textAlign: 'center',
    color: globals.LIGHT_GRAY,
  },
  icon3: {
    fontFamily: globals.BODY_FONT,
    fontSize: globals.FONT_SIZE_SMALL,
    textAlign: 'center',
    color: globals.RED,
  },
  highlightBar: {
    height: 35,
    marginBottom: 60,
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  navButton: {
    marginLeft: 5,
    marginRight: 5,
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
  },
  defaultTouchable: {
    paddingTop: 5,
    backgroundColor: globals.GRAY,
  },
  selectedTouchable: {
    paddingTop: 5,
    backgroundColor: globals.OFF_WHITE,
  },
  touchableLabel: {
    fontSize: globals.FONT_SIZE_MEDIUM,
    textAlign: 'center',
  },
  listViewHeader: {
    flex: 1,
    padding: 8,
    flexDirection: 'column',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: globals.GRAY,
  },
  listView: {
    marginTop: 20,
    marginBottom: 5,
    minHeight: 555,
    alignSelf: 'stretch',
  },
  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: globals.GRAY,
  },
  eventRow: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    padding: 12,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  eventContent: {
    flex: 1,
    flexDirection: 'row',
  },
  createEventForm: {
    minHeight: 580,
    alignSelf: 'stretch',
  },
  formInput: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    flexDirection: 'column',
  },
  inputGroup: {
    height: 30,
    alignSelf: 'stretch',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  label: {
    paddingTop: 5,
    flex: 0.33,
    flexDirection: 'row',
    fontWeight: 'bold',
  },
  input: {
    height: 30,
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 8,
    fontSize: globals.FONT_SIZE_MEDIUM,
    backgroundColor: globals.OFF_WHITE,
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: globals.GRAY,
  },
  inputWithLabel: {
    height: 30,
    flex: 0.66,
    flexDirection: 'row',
    paddingHorizontal: 8,
    fontSize: globals.FONT_SIZE_MEDIUM,
    backgroundColor: globals.OFF_WHITE,
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: globals.GRAY,
  }
});
