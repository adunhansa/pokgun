/*  jQuery Nice Select - v1.1.0
 https://github.com/hernansartorio/jquery-nice-select
 Made by Hernán Sartorio  */

(function($) {

    $.fn.niceSelect = function(method) {

        // Methods
        if (typeof method == 'string') {
            if (method == 'update') {
                this.each(function() {
                    var $select = $(this);
                    var $dropdown = $(this).next('.nice-select');
                    var open = $dropdown.hasClass('open');

                    if ($dropdown.length) {
                        $dropdown.remove();
                        create_nice_select($select);

                        if (open) {
                            $select.next().trigger('click');
                        }
                    }
                });
            } else if (method == 'destroy') {
                this.each(function() {
                    var $select = $(this);
                    var $dropdown = $(this).next('.nice-select');

                    if ($dropdown.length) {
                        $dropdown.remove();
                        $select.css('display', '');
                    }
                });
                if ($('.nice-select').length == 0) {
                    $(document).off('.nice_select');
                }
            } else {
                console.log('Method "' + method + '" does not exist.')
            }
            return this;
        }

        // Hide native select
        this.hide();

        // Create custom markup
        this.each(function() {
            var $select = $(this);

            if (!$select.next().hasClass('nice-select')) {
                create_nice_select($select);
            }
        });

        function getStar(i){
            var str = "<i class='fa fa-star' aria-hidden='true'></i>";
            var result = "";
            for(var j=0;j<i;j++){
                result = result + str;
            }
            return result;
        }

        function getStr(i, text){
            return "<span class='stars'>" +getStar(i) + "</span> <span class='texts'>"+  text+"</span>";
        }

        function create_nice_select($select) {

            var hasSelectStar = $select.hasClass("hasstar");
            $select.after($('<div></div>')
                .addClass('nice-select')
                .addClass($select.attr('class') || '')
                .addClass(hasSelectStar ? 'hasstar' : '')
                .addClass($select.attr('disabled') ? 'disabled' : '')
                .attr('tabindex', $select.attr('disabled') ? null : '0')
                .html('<span class="current"></span><ul class="list"></ul>')
            );

            var $dropdown = $select.next();
            var $options = $select.find('option');
            var $selected = $select.find('option:selected');

            var currentHtml  = hasSelectStar ? getStr($selected.data("star"), $selected.text()) : $selected.text();

            $dropdown.find('.current').html($selected.data('display') || currentHtml);

            $options.each(function(i) {
                var $option = $(this);
                var display = $option.data('display');

                var hasStar = typeof $option.data("star") != "undefined";
                var hasLink = typeof $option.data("link") != "undefined";

                $dropdown.find('ul').append($('<li></li>')
                    .attr('data-value', $option.val())
                    .attr('data-display', (display || null))
                    .attr('data-link', hasLink ? $option.data("link") : '')
                    .addClass('option' +
                        ($option.is(':selected') ? ' selected' : '') +
                        ($option.is(':disabled') ? ' disabled' : '') +
                        (hasStar ? ' hasstar' : '') +
                        (hasLink ? ' haslink' : '')
                    )
                    .html(
                        hasStar ?
                            "<span class='stars'>" +getStar($option.data("star")) + "</span> <span class='texts'>"+ $option.text() +"</span>" :
                            $option.text())
                );
            });
        }

      /* Event listeners */

        // Unbind existing events in case that the plugin has been initialized before
        $(document).off('.nice_select');

        // Open/close
        $(document).on('click.nice_select', '.nice-select', function(event) {
            var $dropdown = $(this);

            $('.nice-select').not($dropdown).removeClass('open');
            $dropdown.toggleClass('open');

            if ($dropdown.hasClass('open')) {
                $dropdown.find('.option');
                $dropdown.find('.focus').removeClass('focus');
                $dropdown.find('.selected').addClass('focus');
            } else {
                $dropdown.focus();
            }
        });

        // Close when clicking outside
        $(document).on('click.nice_select', function(event) {
            if ($(event.target).closest('.nice-select').length === 0) {
                $('.nice-select').removeClass('open').find('.option');
            }
        });

        // Option click
        $(document).on('click.nice_select', '.nice-select .option:not(.disabled)', function(event) {

            var $option = $(this);
            var $dropdown = $option.closest('.nice-select');

            $dropdown.find('.selected').removeClass('selected');
            $option.addClass('selected');

            var hasStar = $option.hasClass("hasstar");

            var currentHtml  = hasStar ? $option.html() : $option.text();

            var text = $option.data('display') || currentHtml;

            $dropdown.find('.current').html(text);

            $dropdown.prev('select').val($option.data('value')).trigger('change');
        });

        // Keyboard events
        $(document).on('keydown.nice_select', '.nice-select', function(event) {
            var $dropdown = $(this);
            var $focused_option = $($dropdown.find('.focus') || $dropdown.find('.list .option.selected'));

            // Space or Enter
            if (event.keyCode == 32 || event.keyCode == 13) {
                if ($dropdown.hasClass('open')) {
                    $focused_option.trigger('click');
                } else {
                    $dropdown.trigger('click');
                }
                return false;
                // Down
            } else if (event.keyCode == 40) {
                if (!$dropdown.hasClass('open')) {
                    $dropdown.trigger('click');
                } else {
                    var $next = $focused_option.nextAll('.option:not(.disabled)').first();
                    if ($next.length > 0) {
                        $dropdown.find('.focus').removeClass('focus');
                        $next.addClass('focus');
                    }
                }
                return false;
                // Up
            } else if (event.keyCode == 38) {
                if (!$dropdown.hasClass('open')) {
                    $dropdown.trigger('click');
                } else {
                    var $prev = $focused_option.prevAll('.option:not(.disabled)').first();
                    if ($prev.length > 0) {
                        $dropdown.find('.focus').removeClass('focus');
                        $prev.addClass('focus');
                    }
                }
                return false;
                // Esc
            } else if (event.keyCode == 27) {
                if ($dropdown.hasClass('open')) {
                    $dropdown.trigger('click');
                }
                // Tab
            } else if (event.keyCode == 9) {
                if ($dropdown.hasClass('open')) {
                    return false;
                }
            }
        });

        // Detect CSS pointer-events support, for IE <= 10. From Modernizr.
        var style = document.createElement('a').style;
        style.cssText = 'pointer-events:auto';
        if (style.pointerEvents !== 'auto') {
            $('html').addClass('no-csspointerevents');
        }

        return this;

    };

}(jQuery));