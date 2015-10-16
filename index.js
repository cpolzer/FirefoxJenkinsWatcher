var self = require('sdk/self');
var notifications = require("sdk/notifications");
var { setInterval } = require("sdk/timers");
var Request = require("sdk/request").Request;
var ui = require("sdk/ui");
var preferences = require('sdk/simple-prefs');

var status_button = ui.ActionButton({
  id: "jenkins_watcher",
  label: "jenkins watcher",
  icon: {
    "16": "./bug_16x16.png",
    "32": "./bug_32x32.png",
    "64": "./bug_64x64.png"
    },
   badge: ""
});

var intervalID = setInterval(function() {
  var jenkins_view_url = preferences.prefs['jenkins_url'],
   jenkins_view_name = preferences.prefs['jenkins_view_name'],
   api_url = preferences.prefs['api_url'],
   matching_colors = preferences.prefs['matching_colors'];

  Request({
    url: jenkins_view_url + "/view/" + jenkins_view_name + "/" + api_url,
    onComplete: function (response) {
      if(response.status == 200){
        var jobs = response.json.jobs;

        var failing_projects = jobs.filter(function (job) {
          return matching_colors.indexOf(job.color) >= 0;
        });

        var job_names = failing_projects.map(function(project){
            return project.name;
        });

        if(job_names.length >  0){
          status_button.badge = job_names.length;
          status_button.badgeColor = "#FF0000";
        }else{
          status_button.badge = "";
        }
      }
    }
 }).get();
}, 10000);
