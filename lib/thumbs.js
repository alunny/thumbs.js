(function(scope, doc) {

    /**
     * Utility function to check event support
     *
     * Cannot inspect document.body because it may not be loaded yet
     *
     * @param  {String} name of the event
     * @return {Boolean}
     */
    function supports(name) {
        return (typeof doc['on' + name] != 'undefined');
    };

    /**
     * Do not use thumbs.js on touch-enabled devices
     */
    if (supports('touchstart')) return;

    /**
     * Map touch events to mouse events
     */
    var eventMap = {
        'mousedown': 'touchstart',
        'mouseup':   'touchend',
        'mousemove': 'touchmove'
    };

    /**
     * Fire touch events
     *
     * Monitor mouse events and fire a touch event on the
     * object broadcasting the mouse event. This approach
     * likely has poorer performance than hijacking addEventListener
     * but it is a little more browser friendly.
     */
    scope.addEventListener('load', function() {
        for (var key in eventMap) {
            doc.body.addEventListener(key, function(e) {
                var event = createTouchEvent(eventMap[e.type], e);
                e.target.dispatchEvent(event);
            }, false);
        }
    }, false);

    /**
     * Utility function to create a touch event.
     *
     * @param  name  {String} of the event
     * @return event {Object}
     */
    function createTouchEvent(name, e) {
        var event = doc.createEvent('MouseEvents');

        event.initMouseEvent(
            name,
            e.cancelBubble,
            e.cancelable,
            e.view,
            e.detail,
            e.screenX,
            e.screenY,
            e.clientX,
            e.clientY,
            e.ctrlKey,
            e.altKey,
            e.shiftKey,
            e.metaKey,
            e.button,
            e.relatedTarget
        );

        return event;
    };

})(window, document);
