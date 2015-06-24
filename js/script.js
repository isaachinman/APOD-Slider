/* APOD SLIDER / ISAAC HINMAN / 2015 */

// MONTH NAMES
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// SLIDE ARRAY
window.imgIds = [];


// GENERATE SLIDE FUNCTION
    function generateSlides() {

        var stopGeneratingSlides = (window.imgIds.length + 10);

        var startLength = (window.imgIds.length + 1);

        for (var i = startLength; i < stopGeneratingSlides; i++) {

            // SET UP NEW SLIDE HTML
            document.getElementById('lightSlider').innerHTML += '<li id="apodLi'+i+'"></li>';
            window.imgIds.push('apod'+i);

            // GENERATE XML REQUEST
            function slideSetUp(callback) {

                // GENERATE DATE
                var date = new Date();
                date.setDate(date.getDate() - (i-1));
                var day = date.getDate();
                var month = ("0" + (date.getMonth() +1)).slice(-2);
                var monthName = date.getMonth();
                var year = date.getFullYear();

                var apodUrl = "https://api.nasa.gov/planetary/apod?concept_tags=True&date=" + year + "-" + month + "-" + day + "&api_key=5iF1Ge5myl5KDyqPuyZ1XxQyAMCNxbCt0dlR3M7R";
                var apodXml = new XMLHttpRequest();
                apodXml.open('GET', apodUrl, true);
                apodXml.send(null);

                // WHEN REQUEST IS READY, ADD IMG SRC
                apodXml.onreadystatechange=function() {
                    if (apodXml.readyState==4 && apodXml.status==200) {
                        var apodParse = JSON.parse(apodXml.responseText);
                        callback(apodParse);
                    }
                }
            }

                slideSetUp(
                    (function(i, day, monthName, year) {
                        return function(result) {

                            var mediaType = result.media_type;

                            function createDOM() {
                                if (mediaType == "image") {
                                    document.getElementById("apodLi"+i).innerHTML += '<img id="apod' + i + '" class="rounded-corners apod-image"><br><span id="apod' + i + 'Date"></span>';
                                } else if (mediaType == "video") {
                                    document.getElementById("apodLi"+i).innerHTML += '<iframe id="apod' + i + '" class="apod-video" frameBorder="0"></iframe><br><span id="apod' + i + 'Date"></span>';
                                }
                            }

                            function fillDOM() {
                                // GENERATE DATE
                                var date = new Date();
                                date.setDate(date.getDate() - (i-1));
                                var day = date.getDate();
                                var monthName = date.getMonth();
                                var year = date.getFullYear();
                                document.getElementById('apod'+i).src = result.url;
                                document.getElementById('apod'+i+"Date").innerHTML = day + " " + monthNames[monthName] + " " + year;
                            }

                            createDOM();
                            fillDOM();
                        }
                    })(i)
                );
        }
    }

    generateSlides();

// SET UP SLIDER
window.slider = $("#lightSlider").lightSlider({
        item: 1,
        adaptiveHeight: true,
        enableTouch: true,
        enableDrag: true,
        loop: false,
        speed: 0,
        keyPress: true,
        slideMargin: 0,
        gallery: false,

        // AFTER EACH SLIDE TRANSITION, DO THIS
        onAfterSlide: function (el) {

            // WHEN GETTING CLOSE TO END OF SLIDES, ADD MORE
            triggerSlide = '#apod' + (window.imgIds.length - 3);

            if ($(triggerSlide).parent().hasClass("active")) {
                generateSlides();
                window.slider.refresh();
            };

        },

    });
