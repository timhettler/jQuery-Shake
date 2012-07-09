// Original script: http://www.jeffreyharrell.com/blog/2010/11/creating-a-shake-event-in-mobile-safari/
// Thanks to Ben Allman's write-up of jQuery Special Events: http://benalman.com/news/2010/03/jquery-special-events/

// jQuery shake event by Tim Hettler
(function ($) {
    "use strict";

    $.event.special.shake = {

        setup: function ( data, namespaces ) {

            var $self = $(this);

            //if ( typeof this.DeviceMotionEvent != 'undefined' ) {

                $self
                    .data('shake', {
                        sensitivity : data || 15,
                        isMoving: false,
                        didShake: false,
                        timeout_id: null,
                        change: 0,
                        x1 : 0,
                        y1 : 0,
                        z1 : 0,
                        x2 : 0,
                        y2 : 0,
                        z2 : 0
                    })
                    .on('devicemotion.shake', function ( event ) {

                        var originalEvent = event.originalEvent,
                            data = $self.data('shake');

                        data.x1 = originalEvent.accelerationIncludingGravity.x;
                        data.y1 = originalEvent.accelerationIncludingGravity.y;
                        data.z1 = originalEvent.accelerationIncludingGravity.z;

                        poll();
                    });

            //}
        },

        teardown: function ( namespaces ) {

            var $self = $(this);

            $self
                .removeData('shake')
                .off('devicemotion.shake');
        }

    };

    function poll () {

        var $elem = $(window),
            data = $elem.data('shake');

        data.change = Math.abs(data.x1-data.x2+data.y1-data.y2+data.z1-data.z2);

        if(data.change > data.sensitivity) {
            data.didShake = true;
            clearTimeout(data.timeout_id);
            data.timeout_id = setTimeout(determineShake,250);
        }

        data.x2 = data.x1;
        data.y2 = data.y1;
        data.z2 = data.z1;

    }

    function determineShake() {

        var $elem = $(window),
            data = $elem.data('shake');

        if (data.didShake) {
            $elem.triggerHandler('shake');
            data.didShake = false;
        }

    }

})(jQuery);