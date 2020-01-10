(() => {
    document.addEventListener('DOMContentLoaded', () => {
        let frame;

        document.getElementById('getInsightsBtn').onclick = () => {
            // capture frame from video to canvas
            frame = captureVideoFrame('remoteVideo', 'png');
            // Show the image
            let img = document.getElementById('my-screenshot');
            img.setAttribute('src', frame.dataUri);
            // Upload and analyze with Google Cloud Vision
            upload();
        };

        function upload() {
            let request = {
                "requests":[
                    {
                        "image":{ "content": frame.dataUriBase64 },
                        "features":[
                            {
                                "type": "WEB_DETECTION",
                                "maxResults":10
                            }
                        ],
                        // "imageContext": {
                            // "webDetectionParams": {
                            //     "includeGeoResults": true
                            // }
                        // }
                    }
                ]
            };

            $.ajax({
                method: 'POST',
                url: 'https://vision.googleapis.com/v1/images:annotate?key=<gckey>',
                contentType: 'application/json',
                data: JSON.stringify(request),
                processData: false,
                success: function(data){
                    output = data;
                    // console.log(data);
                    let websData = data.responses[0];
                    // console.log('joy: ' + faceData.joyLikelihood);
                    // console.log('sorrow: ' + faceData.sorrowLikelihood);
                    console.log(websData.webDetection);
                    Swal.fire({
                        position: 'top-end',
                        title: `Sweet! Detected: ${JSON.stringify(websData.webDetection.bestGuessLabels[0].label)}`,
                        text: 'Found similar image.',
                        imageUrl: websData.webDetection.visuallySimilarImages[0].url,
                        imageWidth: 400,
                        imageHeight: 200,
                        imageAlt: `${websData.webDetection.bestGuessLabels[0].label}_image`,
                        showConfirmButton: false,
                        timer: 5000
                    })
                },
                error: function (data, textStatus, errorThrown) {
                    console.log('error: ' + JSON.stringify(data));
                    console.log(textStatus);
                }
            })
        }
    });
})();

