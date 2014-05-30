mode_manager.modes["main"] = new (function () {
    this.in = function() {
        frameProcessFunc = filterOnBaseAndFrontColor;
    };
});

mode_manager.modes["base_color"] = new (function () {
    this.in = function() {
        frameProcessFunc = filterOnBaseColor;
        
        el_viewport = document.getElementById("viewport");
        el_viewport.style.cursor = "pointer";
        addListener(el_viewport, "click", pickColor);
    };
    this.out = function () {
        store_color_boudaries();
        
        el_viewport = document.getElementById("viewport");
        el_viewport.style.cursor = "default";
        removeListener(el_viewport, "click", pickColor);
    };
    
    function pickColor (e) {
        var e = e || window.event;
        if (e.button == 0){
            var pixData = c2d_video.getImageData((e.clientX - e.target.offsetLeft), (e.clientY - e.target.offsetTop), 1, 1);
            color_boudaries_update["base_r"](pixData.data[0]);
            color_boudaries_update["base_g"](pixData.data[1]);
            color_boudaries_update["base_b"](pixData.data[2]);
        }
    }
});

mode_manager.modes["front_color"] = new (function () {
    this.in = function() {
        frameProcessFunc = filterOnFrontColor;

        el_viewport = document.getElementById("viewport");
        el_viewport.style.cursor = "pointer";
        addListener(el_viewport, "click", pickColor);
    };
    this.out = function () {
        store_color_boudaries();
        
        el_viewport = document.getElementById("viewport");
        el_viewport.style.cursor = "default";
        removeListener(el_viewport, "click", pickColor);
    };
    
    function pickColor (e) {
        var e = e || window.event;
        if (e.button == 0){
            var pixData = c2d_video.getImageData((e.clientX - e.target.offsetLeft), (e.clientY - e.target.offsetTop), 1, 1);
            color_boudaries_update["front_r"](pixData.data[0]);
            color_boudaries_update["front_g"](pixData.data[1]);
            color_boudaries_update["front_b"](pixData.data[2]);
        } 
    }
});

function filterOnBaseAndFrontColor(frameData) {
    var bu = color_boudaries.base_u | 0,
            bl = color_boudaries.base_l | 0,
            bc = color_boudaries.base_c | 0,
            br = color_boudaries.base_r | 0,
            bg = color_boudaries.base_g | 0,
            bb = color_boudaries.base_b | 0,
            fu = color_boudaries.front_u | 0,
            fl = color_boudaries.front_l | 0,
            fc = color_boudaries.front_c | 0,
            fr = color_boudaries.front_r | 0,
            fg = color_boudaries.front_g | 0,
            fb = color_boudaries.front_b | 0;

    // Colorfiltering:
    // Check every pixel in the image data of the current frame.
    for (i = 0; i < frameData.data.length; i++) {
        // Color values for this pixel.
        var r = frameData.data[i++],
                g = frameData.data[i++],
                b = frameData.data[i++];

        // Red within base lightness boundaries?
        if (r <= bu && r >= bl) {
            // Selected blue and green value relative to the red
            // value of this pixel.
            var bg2 = r - br + bg,
                    bb2 = r - br + bb;

            // Green and blue within base deviation boundaries?
            if (g >= bg2 - bc &&
                    g <= bg2 + bc &&
                    b >= bb2 - bc &&
                    b <= bb2 + bc) {
                // Indicate pixel is within the base color 
                // boundaries by making it purple.
                frameData.data[i - 3] = 255;
                frameData.data[i - 2] = 0;
                frameData.data[i - 1] = 255;
            }
        }

        // Red within front lightness boundaries?
        if (r <= fu && r >= fl) {
            // Selected blue and green value relative to the red
            // value of this pixel.
            var fg2 = r - fr + fg,
                    fb2 = r - fr + fb;

            // Green and blue within base deviation boundaries?
            if (g >= fg2 - fc &&
                    g <= fg2 + fc &&
                    b >= fb2 - fc &&
                    b <= fb2 + fc) {
                // Indicate pixel is within the front color 
                // boundaries by making it lime.
                frameData.data[i - 3] = 0;
                frameData.data[i - 2] = 255;
                frameData.data[i - 1] = 0;
            }
        }
    }
}

function filterOnBaseColor(frameData) {
    var bu = color_boudaries.base_u | 0,
            bl = color_boudaries.base_l | 0,
            bc = color_boudaries.base_c | 0,
            br = color_boudaries.base_r | 0,
            bg = color_boudaries.base_g | 0,
            bb = color_boudaries.base_b | 0;

    // Colorfiltering:
    // Check every pixel in the image data of the current frame.
    for (i = 0; i < frameData.data.length; i++) {
        // Color values for this pixel.
        var r = frameData.data[i++],
                g = frameData.data[i++],
                b = frameData.data[i++];

        // Red within base lightness boundaries?
        if (r <= bu && r >= bl) {
            // Selected blue and green value relative to the red
            // value of this pixel.
            var bg2 = r - br + bg,
                    bb2 = r - br + bb;

            // Green and blue within base deviation boundaries?
            if (g >= bg2 - bc &&
                    g <= bg2 + bc &&
                    b >= bb2 - bc &&
                    b <= bb2 + bc) {
                // Indicate pixel is within the base color 
                // boundaries by making it purple.
                frameData.data[i - 3] = 255;
                frameData.data[i - 2] = 0;
                frameData.data[i - 1] = 255;
            }
        }
    }
}

function filterOnFrontColor(frameData) {
    var fu = color_boudaries.front_u | 0,
            fl = color_boudaries.front_l | 0,
            fc = color_boudaries.front_c | 0,
            fr = color_boudaries.front_r | 0,
            fg = color_boudaries.front_g | 0,
            fb = color_boudaries.front_b | 0;

    // Colorfiltering:
    // Check every pixel in the image data of the current frame.
    for (i = 0; i < frameData.data.length; i++) {
        // Color values for this pixel.
        var r = frameData.data[i++],
                g = frameData.data[i++],
                b = frameData.data[i++];

        // Red within front lightness boundaries?
        if (r <= fu && r >= fl) {
            // Selected blue and green value relative to the red
            // value of this pixel.
            var fg2 = r - fr + fg,
                    fb2 = r - fr + fb;

            // Green and blue within base deviation boundaries?
            if (g >= fg2 - fc &&
                    g <= fg2 + fc &&
                    b >= fb2 - fc &&
                    b <= fb2 + fc) {
                // Indicate pixel is within the front color 
                // boundaries by making it lime.
                frameData.data[i - 3] = 0;
                frameData.data[i - 2] = 255;
                frameData.data[i - 1] = 0;
            }
        }
    }
}