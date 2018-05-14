/* 
		You can modify its contents.
*/
const extend = require('js-base/core/extend');
const InfoDesign = require('ui/ui_info');
const Router = require("sf-core/ui/router");
const Common = require("../lib/common");
const System = require('sf-core/device/system');
const Application = require("sf-core/application");

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
      if (System.fingerPrintAvailable) {
          System.validateFingerPrint({
              android: {
                  title: "Title"
              },
              message: "Message",
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

const renderUI = (page)=>{
  
  page.statusBar.visible = true;
   page.title.text = lang['infoPage']['title'];
   page.informationLibraryTitle.text = lang['infoPage']['informationLibraryTitle'];
   page.callUsTitle.text = lang['infoPage']['callUsTitle'];
   page.sendMessageTitle.text = lang['infoPage']['sendMessageTitle'];
   page.rememberMeTitle.text = lang['infoPage']['rememberMeTitle'];
   page.fingerprintTitle.text = lang['infoPage']['fingerprintTitle'];
   page.notificationsTitle.text = lang['infoPage']['notificationsTitle'];
   
   page.row.onTouchEnded = () => Router.go('tabs/info/library');
   page.icon2.onTouchEnded = () => Common.callPhone("+1-917-696-8662");
   page.icon3.onTouchEnded = () => Application.call("mailto:sales@smartface.io");
}
module && (module.exports = Info);