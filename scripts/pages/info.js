/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const InfoDesign = require('ui/ui_info');
const Router = require("sf-core/ui/router");
const Common = require("../lib/common");
const System = require('sf-core/device/system');
const AlertView = require('sf-core/ui/alertview');
const Application = require("sf-core/application");
const WebBrowser = require('sf-core/ui/webbrowser');
const Data = require('sf-core/data');
const Notifications = require("sf-core/notifications");

const Info = extend(InfoDesign)(
  // Constructor
  function(_super) {
    // Initalizes super class for this page scope
    _super(this);

    // overrides super.onShow method
    this.onShow = onShow.bind(this, this.onShow.bind(this));
    // overrides super.onLoad method
    this.onLoad = onLoad.bind(this, this.onLoad.bind(this));
  });

/**
 * @event onShow
 * This event is called when a page appears on the screen (everytime).
 * @param {function} superOnShow super onShow function
 * @param {Object} parameters passed from Router.go function
 */
function onShow(superOnShow) {
  superOnShow();
}

/**
 * @event onLoad
 * This event is called once when page is created.
 * @param {function} superOnLoad super onLoad function
 */
function onLoad(superOnLoad) {
  superOnLoad();
  renderUI(this);
  this.fingerprintSwitch.onToggleChanged = (state) => {
    if (state) {
      if (System.fingerPrintAvailable) {
        System.validateFingerPrint({
          message: "Login with fingerprint",
          onSuccess: function() {
            alert(lang['loginPage']['loginSuccessAlertMessage']);
          },
          onError: function() {
            alert(lang['loginPage']['loginFailedAlertMessage']);
          }
        });
      }
      else {
        if (System.OS === 'iOS') {
          alert("Fingerprint is not available. You should enable TouchID to use this authentication.");
        }
        else {
          alert("Fingerprint is not available. If your device supprorts fingerprint, you should add at least one fingerprint.");
        }
      }
    }
  }

  this.notificationsSwitch.onToggleChanged = (state) => {
    if (state) {
      Notifications.registerForPushNotifications(function(e) {
        Data.setStringVariable('pushToken', e.token);
        alert(e.token);
      }, function() {
        alert("Push Failed:");
        console.log("Register failed.");
      });
    }
    else {
      alert('Unregistered push notifications!')
      Notifications.unregisterForPushNotifications();
    }
  }
}

const renderUI = (page) => {

  page.statusBar.visible = true;
  page.title.text = lang['infoPage']['title'];
  page.informationLibraryTitle.text = lang['infoPage']['informationLibraryTitle'];
  page.callUsTitle.text = lang['infoPage']['callUsTitle'];
  page.sendMessageTitle.text = lang['infoPage']['sendMessageTitle'];
  page.rememberMeTitle.text = lang['infoPage']['rememberMeTitle'];
  page.fingerprintTitle.text = lang['infoPage']['fingerprintTitle'];
  page.notificationsTitle.text = lang['infoPage']['notificationsTitle'];
  page.themeTitle.text = lang['infoPage']['themeTitle'];
  page.version.text = 'Version ' + Application.version;

  page.row.onTouchEnded = () => {
    const webOptions = new WebBrowser.Options();
    webOptions.url = "https://www.smartface.io/smartface"
    WebBrowser.show(page, webOptions);
  }

  page.purpleButton.onTouchEnded = () => {
    page.purpleButton.borderWidth = 3;
    page.orangeButton.borderWidth = 0;
    page.themeContext({
      type: "changeTheme",
      theme: "helloTheme"
    });
    page.dispatch({
      type: "invalidate"
    });
  };

  page.orangeButton.onTouchEnded = () => {
    page.purpleButton.borderWidth = 0;
    page.orangeButton.borderWidth = 3;
    page.themeContext({
      type: "changeTheme",
      theme: "orangeTheme"
    });
    page.dispatch({
      type: "invalidate"
    });
  };

  page.icon2.onTouchEnded = () => Common.callPhone("+1-917-696-8662");
  page.icon3.onTouchEnded = () => Application.call("mailto:sales@smartface.io");
  page.logoutButton.onPress = () => logout();
}

const logout = () => {
  const myAlertView = new AlertView({
    title: "Logout",
    message: "Do you really want to logout?"
  });

  myAlertView.addButton({
    type: AlertView.Android.ButtonType.POSITIVE,
    text: "Yes",
    onClick: function() {
      Router.go('login')
    }
  });

  myAlertView.addButton({
    type: AlertView.Android.ButtonType.NEGATIVE,
    text: "No",
    onClick: function() {}
  });

  myAlertView.show();
}
module && (module.exports = Info);
