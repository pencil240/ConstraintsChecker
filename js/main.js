/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';

var getMediaButton = document.querySelector('button#getMedia');
var connectButton = document.querySelector('button#connect');
var hangupButton = document.querySelector('button#hangup');
var autoTestButton = document.querySelector('button#AutoTest');  

getMediaButton.onclick = getMedia;
connectButton.onclick = createPeerConnection;
hangupButton.onclick = hangup;
autoTestButton.onclick = autotest;

var minWidthInput = document.querySelector('div#minWidth input');
var maxWidthInput = document.querySelector('div#maxWidth input');
var minHeightInput = document.querySelector('div#minHeight input');
var maxHeightInput = document.querySelector('div#maxHeight input');
var minFramerateInput = document.querySelector('div#minFramerate input');
var maxFramerateInput = document.querySelector('div#maxFramerate input');


var getUserMediaConstraintsDiv =
    document.querySelector('div#getUserMediaConstraints');
//var OldConstraintsDiv = document.querySelector('div#OldConstraints');
//var NewConstraintsDiv = document.querySelector('div#NewConstraints');
var bitrateDiv = document.querySelector('div#bitrate');
var peerDiv = document.querySelector('div#peer');
var senderStatsDiv = document.querySelector('div#senderStats');
var receiverStatsDiv = document.querySelector('div#receiverStats');

var localVideo = document.querySelector('div#localVideo video');
var remoteVideo = document.querySelector('div#remoteVideo video');
var localVideoStatsDiv = document.querySelector('div#localVideo div');
var remoteVideoStatsDiv = document.querySelector('div#remoteVideo div');

var localPeerConnection = null;
var remotePeerConnection = null;
var localStream = null;
var remoteStream = null;
var bytesPrev;
var timestampPrev;

var isSetRemoteDSPDone = false;//for firefox
var CandidateArray = new Array();

 var currentconstraints =
                {
					frameRate: {max: 0},
					width: { min: 0, max: 0 },
					height: {min: 0, max: 0},
					max_fs:0,
					max_fr:0
                };

//for firefox
var TestFlag = false;
var TestVideoWidth = 640;
var TestVideoHeight = 360;
var TestFrameRate = 15;
var TestResult = {width:0,height:0,frameRate:0};
var TestArray =[{width:1920,height:1080,frameRate:15},{width:1280,height:720,frameRate:15},{width:640,height:360,frameRate:15}];
var TestCount = 0;

//for edge/safari
var TestFlagEx = false;
var TestDeviceList = [];
var TestCountEx = 0;
var TestVideoWidthEx = 640;
var TestVideoHeightEx = 360;
var TestFrameRateEx = 15;
var TestResultEx = {localwidth:0,localheight:0,width:0,height:0,frameRate:0,status:null};
var TestingConstraintsEx = 
{
  "description":"null",
  "audio":false,
  "video":
  {
    "width": { "min": "0", "max": "0" },
    "height": { "min": "0", "max": "0" },
    "frameRate":{"min": 0,"max":0}
  }
};

var TestArrayEx = 
[
  {
    "description":"1920x1080(1920,1080)",
    "audio":false,
    "video":
    {
      "width": 1920,
      "height": 1080
    }
  },
  {
    "description":"1280x720(1280,720)",
    "audio":false,
    "video":
    {
      "width": 1280,
      "height": 720
    }
  },
  {
    "description":"640x480(640,480)",
    "audio":false,
    "video":
    {
      "width": 640,
      "height": 480
    }
  },
  {
    "description":"640x360(640,360)",
    "audio":false,
    "video":
    {
      "width": 640,
      "height": 360
    }
  },
  {
    "description":"352x288(352,288)",
    "audio":false,
    "video":
    {
      "width": 352,
      "height": 288
    }
  },
  {
    "description":"320x240(320,240)",
    "audio":false,
    "video":
    {
      "width": 320,
      "height": 240
    }
  },
  {
    "description":"320x180(320,180)",
    "audio":false,
    "video":
    {
      "width": 320,
      "height": 180
    }
  },
  {
    "description":"320x176(320,176)",
    "audio":false,
    "video":
    {
      "width": 320,
      "height":176
    }
  },
  {
    "description":"176x144(176,144)",
    "audio":false,
    "video":
    {
      "width": 176,
      "height":144
    }
  },
  {
    "description":"160x120(160,120)",
    "audio":false,
    "video":
    {
      "width": 160,
      "height":120
    }
  },
  {
    "description":"1920x1080(exact:1920,exact:1080)",
    "audio":false,
    "video":
    {
      "width": { "exact": "1920"},
      "height": { "exact": "1080"}
    }
  },
  {
    "description":"1280x720(exact:1280,exact:720)",
    "audio":false,
    "video":
    {
      "width": { "exact": "1280"},
      "height": { "exact": "720"}
    }
  },
  {
    "description":"640x480(exact:640,exact:480)",
    "audio":false,
    "video":
    {
      "width": { "exact": "640"},
      "height": { "exact": "480"}
    }
  },
  {
    "description":"640x360(exact:640,exact:360)",
    "audio":false,
    "video":
    {
      "width": { "exact": "640"},
      "height": { "exact": "360"}
    }
  },
  {
    "description":"352x288(exact:352,exact:288)",
    "audio":false,
    "video":
    {
      "width": { "exact": "352"},
      "height": { "exact": "288"}
    }
  },
  {
    "description":"320x240(exact:320,exact:240)",
    "audio":false,
    "video":
    {
      "width": { "exact": "320"},
      "height": { "exact": "240"}
    }
  },
  {
    "description":"320x180(exact:320,exact:180)",
    "audio":false,
    "video":
    {
      "width": { "exact": "320"},
      "height": { "exact": "180"}
    }
  },
  {
    "description":"320x176(exact:320,exact:176)",
    "audio":false,
    "video":
    {
      "width": { "exact": "320"},
      "height":{ "exact": "176"}
    }
  },
  {
    "description":"176x144(exact:176,exact:144)",
    "audio":false,
    "video":
    {
      "width": { "exact": "176"},
      "height":{ "exact": "144"}
    }
  },
  {
    "description":"160x120(exact:160,exact:120)",
    "audio":false,
    "video":
    {
      "width": { "exact": "160"},
      "height":{ "exact": "120"}
    }
  },

  ///-----
  {
    "description":"1920x1080x30(exact:1920,exact:1080,exact:30)",
    "audio":false,
    "video":
    {
      "width": { "exact": "1920"},
      "height": { "exact": "1080"},
      "frameRate":{"exact": 30}
    }
  },
  {
    "description":"1920x1080x30(exact:1920,exact:1080,0-30)",
    "audio":false,
    "video":
    {
      "width": { "exact": "1920"},
      "height": { "exact": "1080"},
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"1920x1080x30(1920-1920,1080-1080,0-30)",
    "audio":false,
    "video":
    {
      "width": { "min": "1920", "max": "1920" },
      "height": { "min": "1080", "max": "1080" },
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"1920x1080x30(0-1920,0-1080,0-30)",
    "audio":false,
    "video":
    {
      "width": { "min": "0", "max": "1920" },
      "height": { "min": "0", "max": "1080" },
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"1920x1080x15(exact:1920,exact:1080,exact:15)",
    "audio":false,
    "video":
    {
      "width": { "exact": "1920"},
      "height": { "exact": "1080"},
      "frameRate":{"exact": 15}
    }
  },
  {
    "description":"1920x1080x15(exact:1920,exact:1080,0-15)",
    "audio":false,
    "video":
    {
      "width": { "exact": "1920"},
      "height": { "exact": "1080"},
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"1920x1080x15(1920-1920,1080-1080,0-15)",
    "audio":false,
    "video":
    {
      "width": { "min": "1920", "max": "1920" },
      "height": { "min": "1080", "max": "1080" },
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"1920x1080x15(0-1920,0-1080,0-15)",
    "audio":false,
    "video":
    {
      "width": { "min": "0", "max": "1920" },
      "height": { "min": "0", "max": "1080" },
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"1280x720x30(exact:1280,exact:720,exact:30)",
    "audio":false,
    "video":
    {
      "width": { "exact": "1280"},
      "height": { "exact": "720"},
      "frameRate":{"exact":30}
    }
  },
  {
    "description":"1280x720x30(exact:1280,exact:720,0-30)",
    "audio":false,
    "video":
    {
      "width": { "exact": "1280"},
      "height": { "exact": "720"},
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"1280x720x30(1280-1280,720-720,0-30)",
    "audio":false,
    "video":
    {
      "width": { "min": "1280", "max": "1280" },
      "height": { "min": "720", "max": "720" },
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"1280x720x30(0-1280,0-720,0-30)",
    "audio":false,
    "video":
    {
      "width": { "min": "0", "max": "1280" },
      "height": { "min": "0", "max": "720" },
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"1280x720x15(exact:1280,exact:720,exact:15)",
    "audio":false,
    "video":
    {
      "width": { "exact": "1280"},
      "height": { "exact": "720"},
      "frameRate":{"exact":15}
    }
  },
  {
    "description":"1280x720x15(exact:1280,exact:720,0-15)",
    "audio":false,
    "video":
    {
      "width": { "exact": "1280"},
      "height": { "exact": "720"},
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"1280x720x15(1280-1280,720-720,0-15)",
    "audio":false,
    "video":
    {
      "width": { "min": "1280", "max": "1280" },
      "height": { "min": "720", "max": "720" },
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"1280x720x15(0-1280,0-720,0-15)",
    "audio":false,
    "video":
    {
      "width": { "min": "0", "max": "1280" },
      "height": { "min": "0", "max": "720" },
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"640x360x30(exact:640,exact:360,exact:30)",
    "audio":false,
    "video":
    {
      "width": { "exact": "640"},
      "height": { "exact": "360"},
      "frameRate":{"exact":30}
    }
  },
  {
    "description":"640x360x30(exact:640,exact:360,0-30)",
    "audio":false,
    "video":
    {
      "width": { "exact": "640"},
      "height": { "exact": "360"},
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"640x360x30(640-640,360-360,0-30)",
    "audio":false,
    "video":
    {
      "width": { "min": "640", "max": "640" },
      "height": { "min": "360", "max": "360" },
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"640x360x30(0-640,0-360,0-30)",
    "audio":false,
    "video":
    {
      "width": { "min": "0", "max": "640" },
      "height": { "min": "0", "max": "360" },
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"640x360x15(exact:640,exact:360,exact:15)",
    "audio":false,
    "video":
    {
      "width": { "exact": "640"},
      "height": { "exact": "360"},
      "frameRate":{"exact":15}
    }
  },
  {
    "description":"640x360x15(exact:640,exact:360,0-15)",
    "audio":false,
    "video":
    {
      "width": { "exact": "640"},
      "height": { "exact": "360"},
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"640x360x15(640-640,360-360,0-15)",
    "audio":false,
    "video":
    {
      "width": { "min": "640", "max": "640" },
      "height": { "min": "360", "max": "360" },
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"640x360x15(0-640,0-360,0-15)",
    "audio":false,
    "video":
    {
      "width": { "min": "0", "max": "640" },
      "height": { "min": "0", "max": "360" },
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"352x288x30(exact:352,exact:288,exact:30)",
    "audio":false,
    "video":
    {
      "width": { "exact": "352"},
      "height": { "exact": "288"},
      "frameRate":{"exact":30}
    }
  },
  {
    "description":"352x288x30(exact:352,exact:288,0-30)",
    "audio":false,
    "video":
    {
      "width": { "exact": "352"},
      "height": { "exact": "288"},
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"352x288x30(352-352,288-288,0-30)",
    "audio":false,
    "video":
    {
      "width": { "min": "352", "max": "352" },
      "height": { "min": "288", "max": "288" },
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"352x288x30(0-352,0-288,0-30)",
    "audio":false,
    "video":
    {
      "width": { "min": "0", "max": "352" },
      "height": { "min": "0", "max": "288" },
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"352x288x15(exact:352,exact:288,exact:15)",
    "audio":false,
    "video":
    {
      "width": { "exact": "352"},
      "height": { "exact": "288"},
      "frameRate":{"exact":15}
    }
  },
  {
    "description":"352x288x15(exact:352,exact:288,0-15)",
    "audio":false,
    "video":
    {
      "width": { "exact": "352"},
      "height": { "exact": "288"},
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"352x288x15(352-352,288-288,0-15)",
    "audio":false,
    "video":
    {
      "width": { "min": "352", "max": "352" },
      "height": { "min": "288", "max": "288" },
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"352x288x15(0-352,0-288,0-15)",
    "audio":false,
    "video":
    {
      "width": { "min": "0", "max": "352" },
      "height": { "min": "0", "max": "288" },
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"320x240x30(exact:320,exact:240,exact:30)",
    "audio":false,
    "video":
    {
      "width": { "exact": "320"},
      "height": { "exact": "240"},
      "frameRate":{"exact":30}
    }
  },
  {
    "description":"320x240x30(exact:320,exact:240,0-30)",
    "audio":false,
    "video":
    {
      "width": { "exact": "320"},
      "height": { "exact": "240"},
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"320x240x30(320-320,240-240,0-30)",
    "audio":false,
    "video":
    {
      "width": { "min": "320", "max": "320" },
      "height": { "min": "240", "max": "240" },
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"320x240x30(0-320,0-240,0-30)",
    "audio":false,
    "video":
    {
      "width": { "min": "0", "max": "320" },
      "height": { "min": "0", "max": "240" },
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"320x240x15(exact:320,exact:240,exact:15)",
    "audio":false,
    "video":
    {
      "width": { "exact": "320"},
      "height": { "exact": "240"},
      "frameRate":{"exact":15}
    }
  },
  {
    "description":"320x240x15(exact:320,exact:240,0-15)",
    "audio":false,
    "video":
    {
      "width": { "exact": "320"},
      "height": { "exact": "240"},
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"320x240x15(320-320,240-240,0-15)",
    "audio":false,
    "video":
    {
      "width": { "min": "320", "max": "320" },
      "height": { "min": "240", "max": "240" },
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"320x240x15(0-320,0-240,0-15)",
    "audio":false,
    "video":
    {
      "width": { "min": "0", "max": "320" },
      "height": { "min": "0", "max": "240" },
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"320x180x30(exact:320,exact:180,exact:30)",
    "audio":false,
    "video":
    {
      "width": { "exact": "320"},
      "height": { "exact": "180"},
      "frameRate":{"exact":30}
    }
  },
  {
    "description":"320x180x30(exact:320,exact:180,0-30)",
    "audio":false,
    "video":
    {
      "width": { "exact": "320"},
      "height": { "exact": "180"},
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"320x180x30(320-320,180-180,0-30)",
    "audio":false,
    "video":
    {
      "width": { "min": "320", "max": "320" },
      "height": { "min": "180", "max": "180" },
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"320x180x30(0-320,0-180,0-30)",
    "audio":false,
    "video":
    {
      "width": { "min": "0", "max": "320" },
      "height": { "min": "0", "max": "180" },
      "frameRate":{"min": 0,"max":30}
    }
  },
  {
    "description":"320x180x15(exact:320,exact:180,exact:15)",
    "audio":false,
    "video":
    {
      "width": { "exact": "320"},
      "height": { "exact": "180"},
      "frameRate":{"exact":15}
    }
  },
  {
    "description":"320x180x15(exact:320,exact:180,0-15)",
    "audio":false,
    "video":
    {
      "width": { "exact": "320"},
      "height": { "exact": "180"},
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"320x180x15(320-320,180-180,0-15)",
    "audio":false,
    "video":
    {
      "width": { "min": "320", "max": "320" },
      "height": { "min": "180", "max": "180" },
      "frameRate":{"min": 0,"max":15}
    }
  },
  {
    "description":"320x180x15(0-320,0-180,0-15)",
    "audio":false,
    "video":
    {
      "width": { "min": "0", "max": "320" },
      "height": { "min": "0", "max": "180" },
      "frameRate":{"min": 0,"max":15}
    }
  }
]



main();

function TestReport()
{
	if (true == TestFlag)
	{
		var testresult = '';
		if (TestResult.width *  TestResult.height !=0 && TestResult.width *  TestResult.height <= TestVideoWidth*TestVideoHeight  && TestResult.width *  TestResult.height <= currentconstraints.max_fs * 256)
		{
			testresult += '<font color="#00FF00">' +TestResult.width + '*'  + TestResult.height + '</font>'
		}
		else
		{
			testresult += '<font color="#FF0000">' +TestResult.width + '*'  + TestResult.height + '</font>'
		}
		if(TestResult.frameRate != 0 && TestResult.frameRate <= TestFrameRate)
		{
			testresult += '<font color="#00FF00">'  + '*'  + TestResult.frameRate + '</font>'
		}
		else
		{
			testresult += '<font color="#FF0000">'  + '*'  + TestResult.frameRate + '</font>'
		}
		
		var constraints = ' <strong>applyconstraints : </strong> ' + 
			'width (' + currentconstraints.width.min + ' - ' + currentconstraints.width.max + ') ' +
			'height (' + currentconstraints.height.min + ' - ' + currentconstraints.height.max + ') ' + 
			'frameRate (0 - ' + currentconstraints.frameRate.max + ') ' + 
			' <strong>SDP : </strong> '  + 
			'max-fs=' + currentconstraints.max_fs + ' ' +
			'max-fr=' + currentconstraints.max_fr;
			
		var currentresult = '\r\n' + '<strong>Parameter : </strong> '+ TestVideoWidth + '*' + TestVideoHeight +  '*' + TestFrameRate + ' <strong>Test Result : </strong>' + testresult + constraints;

		console.log(currentresult);
		$("<p>"+currentresult+"</p>").appendTo("#AutoTestResult");
	}
	//TestFlag = false;
	hangup();
	getMedia();
}


function TestReportEx()
{
  let needcheck = true;
	if (true == TestFlagEx)
	{
    var testresult = '';
    let teststatus = '';
    let resultlocalresolution = '';
    
    if(null == TestResultEx.status)
    {
        //check local result
        if (TestResultEx.localwidth *  TestResultEx.localheight !=0 && TestResultEx.localwidth *  TestResultEx.localheight <= TestVideoWidthEx*TestVideoHeightEx)
        {
          resultlocalresolution += '<font color="#00FF00">' +TestResultEx.localwidth + '*'  + TestResultEx.localheight + '</font>';
        }
        else
        {
          resultlocalresolution += '<font color="#FF0000">' +TestResultEx.localwidth + '*'  + TestResultEx.localheight + '</font>';
        }

        //check remote result
        if (TestResultEx.width *  TestResultEx.height !=0 && TestResultEx.width *  TestResultEx.height <= TestVideoWidthEx*TestVideoHeightEx)
        {
          testresult += '<font color="#00FF00">' +TestResultEx.width + '*'  + TestResultEx.height + '</font>';
        }
        else
        {
          testresult += '<font color="#FF0000">' +TestResultEx.width + '*'  + TestResultEx.height + '</font>';
          teststatus = '<font color="#FF0000">' + 'Fail' + '</font>';
        }

        if(TestResult.frameRate !== 0 && TestFrameRateEx !== 0 && TestResultEx.frameRate <= TestFrameRateEx)
        {
          testresult += '<font color="#00FF00">'  + '*'  + TestResultEx.frameRate + '</font>';
        }
        else if(TestFrameRateEx == 0)
        {
          //add code here
        }
        else
        {
          testresult += '<font color="#FF0000">'  + '*'  + TestResultEx.frameRate + '</font>';
          teststatus = '<font color="#FF0000">' + 'unsupport to check framerate' + '</font>';
        }
      TestResultEx.status = (teststatus == '')?('<font color="#00FF00">' + 'Pass' + '</font>'):(teststatus);
    }
    else
    {
      needcheck = false;
      testresult = '<font color="#FF0000">' +'---' + '</font>';
      resultlocalresolution = '<font color="#FF0000">' +'---' + '</font>';
    }
    
    var row = $('table#results')[0].insertRow(-1);
    var browserVer = row.insertCell(0);
    var label = row.insertCell(1);
    var constraints_video = row.insertCell(2);
    var localresolution = row.insertCell(3);
    var actual = row.insertCell(4);
    var status = row.insertCell(5);
   
    
    browserVer.innerHTML = adapter.browserDetails.browser + " " + adapter.browserDetails.version;
    label.innerHTML = TestingConstraintsEx.description;
    constraints_video.innerHTML = JSON.stringify(TestingConstraintsEx.video);
    localresolution.innerHTML = resultlocalresolution;
    actual.innerHTML = testresult;
    status.innerHTML = TestResultEx.status;
	}
	//TestFlag = false;
  hangup();
  if(adapter.browserDetails.browser == 'edge')
  {
    //do nothing
  }
  else
  {
    if(needcheck == false)
    {
      getMedia();
    }
    else
    {
      setTimeout(getMedia,3000);
    }
  }
  
}

function autotest()
{
  if("safari" == adapter.browserDetails.browser
    ||"edge" == adapter.browserDetails.browser
    ||"chrome" == adapter.browserDetails.browser)
  {
    TestFlagEx = true;
  }
  else if("firefox" == adapter.browserDetails.browser)
  {
    TestFlag = true;
  }
	
	getMedia();
	
	//hangup();
}

function main() {

  navigator.mediaDevices.enumerateDevices()
  .then(gotDevices)
.catch(errorCallback);

  //autotest();
}

function gotDevices(deviceInfos) {
  var camcount = 1;
  for (var i = 0; i !== deviceInfos.length; ++i) {
      var deviceInfo = deviceInfos[i];
      var option = {};
      option.deviceId = deviceInfo.deviceId;
      if (deviceInfo.kind === 'videoinput') {
          option.text = deviceInfo.label || 'camera ' + camcount;
          TestDeviceList.push(option);
          camcount++;
      }
  }
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function hangup() {
  console.log('Ending call');
  //add for test 
  //localPeerConnection.removeStream(localStream);

  //reset
  TestVideoWidthEx = 640;
  TestVideoHeightEx = 360;
  TestFrameRateEx = 15;
  TestResultEx = {localwidth:0,localheight:0,width:0,height:0,frameRate:0,status:null};
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;

  if(localStream !== undefined && localStream !== null)
  {
    
    if(adapter.browserDetails.browser == 'edge')
    {
      localStream.oninactive = function()
      {
        if(true == TestFlagEx)
        {
          getMedia();
        }
      }
    }
    
    
 
    localStream.getTracks().forEach(function(track) {
      track.stop();
    });
    localStream = null;
    
  }
  else
  {
    if(adapter.browserDetails.browser == 'edge')
    {
      setTimeout(getMedia,3000);
    }
  }

  
  if(remoteStream !== undefined && remoteStream !== null)
  {
    remoteStream.getTracks().forEach(function(track) {
      track.stop();
    });
    remoteStream = null;
  }  

  if(localPeerConnection != null && undefined != localPeerConnection.close)
  {
    localPeerConnection.close();
    localPeerConnection = null;
  }
  if(remotePeerConnection != null && undefined != remotePeerConnection.close)
  {
    remotePeerConnection.close();
    remotePeerConnection = null;
  }
  

  hangupButton.disabled = true;
  getMediaButton.disabled = false;
}

function getMedia() {
  //for firefox
	if(TestFlag == true && TestArray.length > 0 && TestCount >= 0)
	{
		//just auto test the parameter in TestArray once.
		
		if(TestArray.length <= TestCount)
		{
			TestCount = 0;
			TestFlag = false;
			return;
		}
		
		TestVideoWidth = TestArray[TestCount%TestArray.length].width;
		TestVideoHeight = TestArray[TestCount%TestArray.length].height;
		TestFrameRate = TestArray[TestCount%TestArray.length].frameRate;
		TestCount++;
  }
  
  //init test parameters for safari/edge
  if(TestFlagEx == true && TestArrayEx.length > 0 && TestCountEx >= 0)
	{
		if(TestArrayEx.length <= TestCountEx)
		{
			TestCountEx = 0;
			TestFlagEx = false;
			return;
    }
    TestingConstraintsEx = JSON.parse(JSON.stringify(TestArrayEx[TestCountEx%TestArrayEx.length]));
    TestingConstraintsEx.video.deviceId = {};
    TestingConstraintsEx.video.deviceId = {"exact":TestDeviceList[0].deviceId};
    TestVideoWidthEx = (TestingConstraintsEx.video.width.exact!==undefined)?TestingConstraintsEx.video.width.exact:(TestingConstraintsEx.video.width.max!==undefined?TestingConstraintsEx.video.width.max:TestingConstraintsEx.video.width);
    TestVideoHeightEx = (TestingConstraintsEx.video.height.exact!==undefined)?TestingConstraintsEx.video.height.exact:(TestingConstraintsEx.video.height.max!==undefined?TestingConstraintsEx.video.height.max:TestingConstraintsEx.video.height);
    TestFrameRateEx = (TestingConstraintsEx.video.frameRate !==undefined)?
    ((TestingConstraintsEx.video.frameRate.exact!==undefined)?TestingConstraintsEx.video.frameRate.exact:TestingConstraintsEx.video.frameRate.max):0;

		TestCountEx++;
  }
  
  getMediaButton.disabled = true;
  if (localStream) {
    localStream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  

  //manual test
  let initConstraints = getUserMediaConstraints();
  //auto test
  if(true == TestFlagEx)
  {
    initConstraints.audio =  TestingConstraintsEx.audio;
    initConstraints.video =  TestingConstraintsEx.video;
  }
  navigator.mediaDevices.getUserMedia(initConstraints)
  .then(gotStream)
  .catch(function(e) {
    var message = 'Fail to getUserMedia : ' + JSON.stringify(e) + ' ' + TestingConstraintsEx.description +'\n';

    TestResultEx.status = '<font color="#FF0000">' + 'Fail:' + JSON.stringify(e) + '</font>';
    TestReportEx();
    //alert(message);
    console.log(message);
    getMediaButton.disabled = false;
    //if(true == TestFlagEx)
    //{
      //getMedia();
    //}
  });
}

function applyNewConstrains(nWidth,nHeight,nFramerate,desp)
{
	
		   //add code for testing firefox applyConstraints
	  var vTracks = localStream.getVideoTracks();
	var lovTrack = undefined;
	if( vTracks.length )
		lovTrack = vTracks[0];
	
	if( lovTrack )
	{
		//var oldconstraints = lovTrack.getConstraints();
		//OldConstraintsDiv.innerHTML='<oldc>Old Constraints :</oldc> ' +'\r\n' + JSON.stringify(oldconstraints, null, '    ');
		//oldconstraints.frameRate.max=15;
		//NewConstraintsDiv.innerHTML='<newc>New Constraints :</newc> ' +'\r\n' + JSON.stringify(oldconstraints, null, '    ');
		
		// user the constraints  width : nWidth - nWidth  ;  height: nHeight - nHeight   ;  frameRate:  0 - nFramerate
		 var constraints =
                {
					frameRate: {max: 30},
					width: { min: 0, max: 1920 },
					height: {min: 0, max: 1080}
                };
         constraints.frameRate.max = nFramerate;
		 constraints.width.min = nWidth;
		 constraints.width.max = nWidth;
		 constraints.height.min = nHeight;
		 constraints.height.max = nHeight;

         var mb_width = (parseInt(nWidth,10) + 15) / 16;
		var mb_height = (parseInt(nHeight,10) + 15) / 16;
		var resolution = Math.floor(mb_width) * Math.floor(mb_height);

        var newfs = 'max-fs=' + resolution;
		var newfr = 'max-fr=' + nFramerate;
         
		lovTrack.applyConstraints(constraints)
			.then(function(val) {
					//var newconstraints = lovTrack.getConstraints();
					//NewConstraintsDiv.innerHTML='<newc>New Constraints :</newc> ' +'\r\n' + JSON.stringify(newconstraints, null, '    ');
					console.log("succeed to applyConstraints : " + JSON.stringify(constraints, null, '    '));

					currentconstraints.frameRate.max = constraints.frameRate.max;
					currentconstraints.width.min = constraints.width.min;
					currentconstraints.width.max = constraints.width.max;
					currentconstraints.height.min = constraints.height.min;
					currentconstraints.height.max = constraints.height.max;
					currentconstraints.max_fs = resolution;
					currentconstraints.max_fr = nFramerate;
					var newsting = desp.sdp.replace(new RegExp(/max-fs=([0-9]){1,}/, 'g'),newfs);
					newsting = newsting.replace(new RegExp(/max-fr=([0-9]){1,}/, 'g'),newfr);

					desp.sdp = newsting;
					console.log(desp.sdp);
					localPeerConnection.setRemoteDescription(desp);
					 isSetRemoteDSPDone = true;
					  while(CandidateArray.length > 0)
					  {
						  var icecandidate  = CandidateArray.pop();
						  localPeerConnection.addIceCandidate(icecandidate)
							.then(
							onAddIceCandidateSuccess,
							onAddIceCandidateError
						);
					  };
             })//.then 1
		  .catch(function(e) {
					console.log("fail to applyConstraints : " + JSON.stringify(constraints, null, '    ') + " retrying new constraints .");
					//use a new constraints  width : 0 - nWidth  ;  height: 0 - nHeight   ;  frameRate:  0 - nFramerate
					constraints.width.min = 0;
					constraints.height.min = 0;

					lovTrack.applyConstraints(constraints)
						.then(function(val) {
								//var newconstraints = lovTrack.getConstraints();
								//NewConstraintsDiv.innerHTML='<newc>New Constraints :</newc> ' +'\r\n' + JSON.stringify(newconstraints, null, '    ');
								console.log("succeed to applyConstraints : " + JSON.stringify(constraints, null, '    '));

								currentconstraints.frameRate.max = constraints.frameRate.max;
								currentconstraints.width.min = constraints.width.min;
								currentconstraints.width.max = constraints.width.max;
								currentconstraints.height.min = constraints.height.min;
								currentconstraints.height.max = constraints.height.max;
								currentconstraints.max_fs = resolution;
								currentconstraints.max_fr = nFramerate;

								var newsting = desp.sdp.replace(new RegExp(/max-fs=([0-9]){1,}/, 'g'),newfs);
								newsting = newsting.replace(new RegExp(/max-fr=([0-9]){1,}/, 'g'),newfr);

								desp.sdp = newsting;
								console.log(desp.sdp);
								localPeerConnection.setRemoteDescription(desp);
								 isSetRemoteDSPDone = true;
								  while(CandidateArray.length > 0)
								  {
									  var icecandidate  = CandidateArray.pop();
									  localPeerConnection.addIceCandidate(icecandidate)
										.then(
										onAddIceCandidateSuccess,
										onAddIceCandidateError
									);
								  };
						})
						.catch(function(e){
								console.log("fail to applyConstraints : " + JSON.stringify(constraints, null, '    ') + " retrying new constraints .");
								//use a new constraints  width : 0 - 1920  ;  height: 0 - 1080   ;  frameRate: 0 - nFramerate * 2
								constraints.width.max = 1920;
								constraints.height.max = 1080;
								constraints.frameRate.max = nFramerate * 2;

								lovTrack.applyConstraints(constraints)
									.then(function(val) {
											//var newconstraints = lovTrack.getConstraints();
											//NewConstraintsDiv.innerHTML='<newc>New Constraints :</newc> ' +'\r\n' + JSON.stringify(newconstraints, null, '    ');
											console.log("succeed to applyConstraints : " + JSON.stringify(constraints, null, '    '));

											currentconstraints.frameRate.max = constraints.frameRate.max;
											currentconstraints.width.min = constraints.width.min;
											currentconstraints.width.max = constraints.width.max;
											currentconstraints.height.min = constraints.height.min;
											currentconstraints.height.max = constraints.height.max;
											currentconstraints.max_fs = resolution/2;
											currentconstraints.max_fr = nFramerate;


											//const senders = localPeerConnection.getSenders();
											//const sender = senders[1];
											//sender.setParameters({
											//encodings: [{ scaleResolutionDownBy: 2 }]
											//});

											// reset the max-fs to max-fs/2 to make sure the max-bmps is equal to the server requests.
											//'max-fs=12288;max-fr=60'
											newfs = 'max-fs=' + resolution/2;
											newfr =  'max-fr=' + nFramerate;


											var newsting = desp.sdp.replace(new RegExp(/max-fs=([0-9]){1,}/, 'g'),newfs);
											newsting = newsting.replace(new RegExp(/max-fr=([0-9]){1,}/, 'g'),newfr);

											desp.sdp = newsting;
											console.log(desp.sdp);
											localPeerConnection.setRemoteDescription(desp);
											 isSetRemoteDSPDone = true;
											  while(CandidateArray.length > 0)
											  {
												  var icecandidate  = CandidateArray.pop();
												  localPeerConnection.addIceCandidate(icecandidate)
													.then(
													onAddIceCandidateSuccess,
													onAddIceCandidateError
												);
											  };
									})
					   .catch(function(e){
										var message = 'applyConstraints error: ' + e.name;
										alert(message);
										console.log(message);
							});// .catch 3
						});// .catch 2
		  });// .catch 1
	}//if( lovTrack )
}//applyNewConstrains


function gotStream(stream) {
  connectButton.disabled = false;
  console.log('GetUserMedia succeeded : ' + TestingConstraintsEx.description);
  localStream = stream;
  localVideo.srcObject = stream;

  
   if(TestFlag == true || TestFlagEx == true)
	{
	   createPeerConnection();
	}
  
}

function getUserMediaConstraints() {
  var constraints = {};
  constraints.audio = true;
  constraints.video = {};
  if (minWidthInput.value !== '0') {
    constraints.video.width = {};
    constraints.video.width.min = minWidthInput.value;
  }
  if (maxWidthInput.value !== '0') {
    constraints.video.width = constraints.video.width || {};
    constraints.video.width.max = maxWidthInput.value;
  }
  if (minHeightInput.value !== '0') {
    constraints.video.height = {};
    constraints.video.height.min = minHeightInput.value;
  }
  if (maxHeightInput.value !== '0') {
    constraints.video.height = constraints.video.height || {};
    constraints.video.height.max = maxHeightInput.value;
  }
  if (minFramerateInput.value !== '0') {
    constraints.video.frameRate = {};
    constraints.video.frameRate.min = minFramerateInput.value;
  }
  if (maxFramerateInput.value !== '0') {
    constraints.video.frameRate = constraints.video.frameRate || {};
    constraints.video.frameRate.max = maxFramerateInput.value;
  }

  return constraints;
}


function createPeerConnection() {
  connectButton.disabled = true;
  hangupButton.disabled = false;

  bytesPrev = 0;
  timestampPrev = 0;
  localPeerConnection = new RTCPeerConnection(null);
  remotePeerConnection = new RTCPeerConnection(null);


 
  localStream.getTracks().forEach(
    function(track) {
	  console.log('localPeerConnection addTrack.');
      localPeerConnection.addTrack(
        track,
        localStream
      );
    }
  );
  
  console.log('localPeerConnection creating offer');
  localPeerConnection.onnegotiationneeded = function(e){
    onNegotiationNeeded(localPeerConnection, e);
  }
    
  localPeerConnection.onicecandidate = function(e) {
    console.log('Candidate localPeerConnection');
    remotePeerConnection.addIceCandidate(e.candidate)
    .then(
      onAddIceCandidateSuccess,
      onAddIceCandidateError
    );
  };

  remotePeerConnection.onicecandidate = function(e) {
    console.log('Candidate remotePeerConnection');
	if (false == isSetRemoteDSPDone && adapter.browserDetails.browser == "firefox")
	{
		CandidateArray.push(e.candidate);
		return;
	}	
    localPeerConnection.addIceCandidate(e.candidate)
    .then(
      onAddIceCandidateSuccess,
      onAddIceCandidateError
    );
  };
  
  remotePeerConnection.ontrack = function(e) {
    if (e.streams !== undefined && remoteVideo.srcObject !== e.streams[0]) {
      console.log('remotePeerConnection got stream');
      remoteVideo.srcObject = e.streams[0];
      remoteStream = e.streams[0];
      
    }
  };
  localPeerConnection.createOffer().then(
    function(desc) {
      console.log('localPeerConnection offering');
	  //desc.sdp = desc.sdp.replace(new RegExp(/m=video(.*?)\r\n/, 'g'),'m=video 9 UDP/TLS/RTP/SAVPF 126 97\r\n');
	  console.log('localPeerConnection setLocalDescription');
      localPeerConnection.setLocalDescription(desc);
      remotePeerConnection.setRemoteDescription(desc);
	  isSetRemoteDSPDone = false;
      remotePeerConnection.createAnswer().then(
        function(desc2) {
          console.log('remotePeerConnection answering');
          remotePeerConnection.setLocalDescription(desc2);
          if(adapter.browserDetails.browser == "firefox")
          {
            applyNewConstrains(TestVideoWidth,TestVideoHeight,TestFrameRate,desc2);
          }
          else
          {
			   console.log('localPeerConnection setRemoteDescription');
            localPeerConnection.setRemoteDescription(desc2);
          }
		  if(TestFlag == true)
		  {
			  setTimeout(TestReport,10000);
      }

      if(TestFlagEx == true)
		  {
			  setTimeout(TestReportEx,10000);
		  }
		  
        },
        function(err) {
          console.log(err);
        }
      );
    },
    function(err) {
      console.log(err);
    }
  );
}

function onAddIceCandidateSuccess() {
  console.log('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
  console.log('Failed to add Ice Candidate: ' + error.toString());
}

function onNegotiationNeeded(pc, event) {
  if (pc) {
    console.log(' onNegotiationNeeded.');
    console.log(event);
  }
}
// Display statistics
setInterval(function() {
  /*
  if (remotePeerConnection && remotePeerConnection.getRemoteStreams()[0]) {
    remotePeerConnection.getStats(null)
    .then(function(results) {
      var statsString = dumpStats(results);
      receiverStatsDiv.innerHTML = '<h2>Receiver stats</h2>' + statsString;
      // calculate video bitrate
      results.forEach(function(report) {
        var now = report.timestamp;

        var bitrate;
		var framerateMean;
        if ( (report.type === 'inboundrtp'|| report.type === 'inbound-rtp') && report.mediaType === 'video') {
          // firefox calculates the bitrate for us
          // https://bugzilla.mozilla.org/show_bug.cgi?id=951496
          bitrate = Math.floor(report.bitrateMean / 1024);
          framerateMean = Math.floor(report.framerateMean);
        } else if (report.type === 'ssrc' && report.bytesReceived &&
             report.googFrameHeightReceived) {
          // chrome does not so we need to do it ourselves
          var bytes = report.bytesReceived;
          if (timestampPrev) {
            bitrate = 8 * (bytes - bytesPrev) / (now - timestampPrev);
            bitrate = Math.floor(bitrate);
          }
          bytesPrev = bytes;
          timestampPrev = now;
        }
        if (bitrate) {
          bitrate += ' kbits/sec';
		  var frMeam = framerateMean + 'fps';
          bitrateDiv.innerHTML = '<strong>Bitrate: </strong>' + bitrate + '<strong> Framerate: </strong>'+frMeam;
      TestResult.frameRate = framerateMean;
      TestResultEx.frameRate = framerateMean;
        }
      });

      // figure out the peer's ip
      var activeCandidatePair = null;
      var remoteCandidate = null;

      // Search for the candidate pair, spec-way first.
      results.forEach(function(report) {
        if (report.type === 'transport') {
          activeCandidatePair = results.get(report.selectedCandidatePairId);
        }
      });
      // Fallback for Firefox and Chrome legacy stats.
      if (!activeCandidatePair) {
        results.forEach(function(report) {
          if (report.type === 'candidate-pair' && report.selected ||
              report.type === 'googCandidatePair' &&
              report.googActiveConnection === 'true') {
            activeCandidatePair = report;
          }
        });
      }
      if (activeCandidatePair && activeCandidatePair.remoteCandidateId) {
        remoteCandidate = results.get(activeCandidatePair.remoteCandidateId);
      }
      if (remoteCandidate) {
        if (remoteCandidate.ip && remoteCandidate.port) {
          peerDiv.innerHTML = '<strong>Connected to:</strong> ' +
              remoteCandidate.ip + ':' + remoteCandidate.port;
        } else if (remoteCandidate.ipAddress && remoteCandidate.portNumber) {
          // Fall back to old names.
          peerDiv.innerHTML = '<strong>Connected to:</strong> ' +
              remoteCandidate.ipAddress +
              ':' + remoteCandidate.portNumber;
        }
      }
    }, function(err) {
      console.log(err);
    });
    localPeerConnection.getStats(null)
    .then(function(results) {
      var statsString = dumpStats(results);
      senderStatsDiv.innerHTML = '<h2>Sender stats</h2>' + statsString;
    }, function(err) {
      console.log(err);
    });
  } else {
    console.log('Not connected yet');
  }
  */
  // Collect some stats from the video tags.
  if (localVideo.videoWidth) {
    localVideoStatsDiv.innerHTML = '<strong>Video dimensions:</strong> ' +
      localVideo.videoWidth + 'x' + localVideo.videoHeight + 'px' + '\r\n';
      TestResultEx.localwidth = localVideo.videoWidth;
      TestResultEx.localheight = localVideo.videoHeight;
    }
  if (remoteVideo.videoWidth) {
    remoteVideoStatsDiv.innerHTML = '<strong>Video dimensions:</strong> ' +
      remoteVideo.videoWidth + 'x' + remoteVideo.videoHeight + 'px';
      TestResult.width = remoteVideo.videoWidth;
      TestResult.height = remoteVideo.videoHeight;
  TestResultEx.width = remoteVideo.videoWidth;
	TestResultEx.height = remoteVideo.videoHeight;
  }
}, 1000);

// Dumping a stats variable as a string.
// might be named toString?
function dumpStats(results) {
  var statsString = '';
  results.forEach(function(res) {
    statsString += '<h3>Report type=';
    statsString += res.type;
    statsString += '</h3>\n';
    statsString += 'id ' + res.id + '<br>\n';
    statsString += 'time ' + res.timestamp + '<br>\n';
    Object.keys(res).forEach(function(k) {
      if (k !== 'timestamp' && k !== 'type' && k !== 'id') {
        statsString += k + ': ' + res[k] + '<br>\n';
      }
    });
  });
  return statsString;
}


