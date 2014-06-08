( function($) {


    var BootstrapLightBox = function($element, options)
    {
        this.init($element, options)
    }

    BootstrapLightBox.DEFAULTS = {
        gallery: true,
        caption: true
    }


    BootstrapLightBox.prototype.getOptions = function ($element, options)
    {
        options = $.extend({}, BootstrapLightBox.DEFAULTS, $element.data(), options)

        if (options.fontSet === undefined) {
            options.fontSet = this.getFontSet();
        }
        return options
    }

    BootstrapLightBox.prototype.init = function($input, options)
    {
        var t = this;

        // get options
        this.options = this.getOptions($input, options);

        if ($('#bootstrap-media-lightbox').length == 0) {

            // close button
            if (this.options.fontSet === "fa" ) {
                var closeButton = '<div id="bootstrap-media-lightbox-close">'+
                    '<span class="fa-stack fa-lg">'+
                    '<i class="fa fa-square fa-stack-2x"></i>'+
                    '<i class="fa fa-times fa-stack-1x fa-inverse" data-dismiss="modal" aria-hidden="true"></i>'+
                    '</span>'+
                    '</div>'
                var backwardButton = '<i class="fa fa-chevron-left"></i>';
                var forwardButton = '<i class="fa fa-chevron-right"></i>';
            } else {
                var closeButton = '<div id="bootstrap-media-lightbox-close">'+
                    '<i class="glyphicon glyphicon-remove-circle" data-dismiss="modal" aria-hidden="true"></i>'+
                    '</div>'
                var backwardButton = '<i class="glyphicon glyphicon-chevron-left"></i>';
                var forwardButton = '<i class="glyphicon glyphicon-chevron-right"></i>';
            }

            $(document.body).append(
                '<div class="modal fade" id="bootstrap-media-lightbox" tabindex="-1" role="dialog" aria-labelledby="bootstrap-media-lightbox-label" aria-hidden="true">'+
                    closeButton+
                    '<div id="bootstrap-media-lightbox-content-container" data-dismiss="modal"></div>'+

                    '<div id="bootstrap-media-lightbox-backward">'+backwardButton+'</div>'+

                    '<div id="bootstrap-media-lightbox-forward">'+forwardButton+'</div>'+

                    '<div id="bootstrap-media-lightbox-caption-container">'+
                        '<div id="bootstrap-media-lightbox-caption"></div>'+
                    '</div>'+
                '</div>'
            );
        }

        $($input).each(function(index) {
            $(this).on("click", function(event){
                event.preventDefault();
                t.updatePictureInLightbox($(this), $input, index);
                $('#bootstrap-media-lightbox').modal('show');
            });
        });

    }

    BootstrapLightBox.prototype.updatePictureInLightbox = function($a, $input, index)
    {
        var t = this;

        if (this.options.gallery === false || $input.size() < 2) {
            $('#bootstrap-media-lightbox-backward').hide();
            $('#bootstrap-media-lightbox-forward').hide();
        } else if (index == 0) {
            $('#bootstrap-media-lightbox-backward').hide();
            $('#bootstrap-media-lightbox-forward').show();
        } else if (index == $input.size() - 1) {
            $('#bootstrap-media-lightbox-backward').show();
            $('#bootstrap-media-lightbox-forward').hide();
        } else {
            $('#bootstrap-media-lightbox-backward').show();
            $('#bootstrap-media-lightbox-forward').show();
        }

        // add content to the lightbox
        var target = $a.attr('href');
        var supportedImageFormats = [ "png", "jpg", "jpeg", "bmp" ]
        var extension =  target.split('.').pop().toLowerCase();
        if ($a.data('target') !== undefined) {

        }
        if ($.inArray(extension, supportedImageFormats) > -1) {
            this.addImage(target);
        } else if (target.substr(0, 22) == "http://www.youtube.com") {
            this.addYoutubeVideo(target);
        } else if (target.substr(0, 16) == "http://vimeo.com") {
            this.addVimeoVideo(target);
        } else if (target.substr(0, 4) == "http") {
            this.addIframe(target);
        }

        this.addCaption($a);

        $( "#bootstrap-media-lightbox-forward").unbind( "click" );
        $('#bootstrap-media-lightbox-forward').click(function() {
            t.updatePictureInLightbox($input.eq(index+1), $input, index+1)
        });
        $( "#bootstrap-media-lightbox-backward").unbind( "click" );
        $('#bootstrap-media-lightbox-backward').click(function() {
            t.updatePictureInLightbox($input.eq(index-1), $input, index-1)
        });

    }


    BootstrapLightBox.prototype.addImage = function(target)
    {
        // set default size if size is undefined
        if (this.options.width === undefined && this.options.height === undefined) {
            var image = new Image();
            image.src = target;
            this.options.width = image.width; // original imagel width
            this.options.height = image.height; // originalImagelHeight
        } else if (this.options.width === undefined) {
            var image = new Image();
            image.src = target;
            this.options.width = this.options.height/image.height*image.width; // originalImagelHeight
        } else if (this.options.height === undefined) {
            var image = new Image();
            image.src = target;
            this.options.height = this.options.width/image.width*image.height; // originalImagelHeight
        }
        this.validateSize();

        var $contentContainer = $('#bootstrap-media-lightbox-content-container');
        $contentContainer.html('<img width="'+this.options.width+'" height="'+this.options.height+'" src="'+target+'" />');

        this.setMargins($contentContainer);
    }

    BootstrapLightBox.prototype.addIframe = function(target)
    {
        // set default size if size is undefined
        if (this.options.width === undefined && this.options.height === undefined) {
            this.options.width = 420;
            this.options.height = 315;
        } else if (this.options.width === undefined) {
            this.options.width = 420/(315/this.options.height);
        } else if (this.options.height === undefined) {
            this.options.height = 315/(420/this.options.width);
        }

        var $contentContainer = $('#bootstrap-media-lightbox-content-container');
        var content = '<iframe style="background-color: white" width="'+this.options.width+'" height="'+this.options.height+'" src="'+target+'" frameborder="0" allowfullscreen></iframe>';
        this.setMargins($contentContainer);
        $contentContainer.html(content);
    }


    BootstrapLightBox.prototype.addYoutubeVideo = function(target)
    {
        // set default size if size is undefined
        if (this.options.width === undefined && this.options.height === undefined) {
            this.options.width = 420;
            this.options.height = 315;
        } else if (this.options.width === undefined) {
            this.options.width = 420/(315/this.options.height);
        } else if (this.options.height === undefined) {
            this.options.height = 315/(420/this.options.width);
        }
        this.validateSize();

        var $contentContainer = $('#bootstrap-media-lightbox-content-container');
        var videoId = target.substr(31)
        var content = '<iframe width="'+this.options.width+'" height="'+this.options.height+'" src="http://www.youtube-nocookie.com/embed/'+videoId+'" frameborder="0" allowfullscreen></iframe>';
        $contentContainer.html(content);

        this.setMargins($contentContainer);
    }




    BootstrapLightBox.prototype.addVimeoVideo = function(target)
    {
        // set default size if size is undefined
        if (this.options.width === undefined && this.options.height === undefined) {
            this.options.width = 420;
            this.options.height = 315;
        } else if (this.options.width === undefined) {
            this.options.width = 420/(315/this.options.height);
        } else if (this.options.height === undefined) {
            this.options.height = 315/(420/this.options.width);
        }
        this.validateSize();


        var $contentContainer = $('#bootstrap-media-lightbox-content-container');
        var videoId = target.substr(17)
        var content = '<iframe width="'+this.options.width+'" height="'+this.options.height+'" src="http://player.vimeo.com/video/'+videoId+'" frameborder="0" allowfullscreen></iframe>';
        $contentContainer.html(content);

        this.setMargins($contentContainer);
    }

    BootstrapLightBox.prototype.addCaption = function($a)
    {
        var caption = $a.attr('title');

        if (caption !== "" && caption !== undefined && this.options.caption === true) {

            $('#bootstrap-media-lightbox-caption-container').show();
            $('#bootstrap-media-lightbox-caption').text(caption);
        } else {
            $('#bootstrap-media-lightbox-caption-container').hide();
        }
    }

    BootstrapLightBox.prototype.getFontSet = function()
    {
        var $fontAwesomeTest = $('<i class="fa"></i>');
        if ($fontAwesomeTest.css('font-family') === "FontAwesome") {
            return "fa"
        }

        return "glyphicon";
    }

    BootstrapLightBox.prototype.validateSize = function(target)
    {
        var windowHeight = $( window ).height();
        var windowWidth = $( window ).width();

        if (this.options.width+50 > windowWidth) {
            var oldWith = this.options.width;
            this.options.width = windowWidth-50;
            this.options.height = this.options.height*this.options.width/oldWith;
        }

        if (this.options.height+80 > windowHeight) {
            var oldHeight = this.options.height;
            this.options.height = windowHeight-80;
            this.options.width = this.options.width*this.options.height/oldHeight;
        }
    }

    BootstrapLightBox.prototype.setMargins = function($element)
    {
        var windowHeight = $( window ).height();
        var windowWidth = $( window ).width();
        $element.css({"margin-top": (windowHeight-50-this.options.height)/2});
        $element.css({"margin-left": (windowWidth-this.options.width)/2});
    }


    $.fn.lightbox = function(options) {

        new BootstrapLightBox($(this), options);
    };

    $('.lightbox').lightbox();

})(jQuery);