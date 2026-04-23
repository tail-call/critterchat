import $ from "jquery";
import { InputState } from "../inputstate.js";

/**
 * I am a hovering window that can be attached to a button or control.
 */
export class HoveringWindow {
    /** @type {JQuery<HTMLElement>} */
    _container;

    /** @type {JQuery<HTMLElement>} */
    button;

    /** @type {InputState} */
    state;

    /**
     * @param {InputState} state 
     * @param {JQuery<HTMLElement>} button 
     * @param {JQuery<HTMLElement>} control 
     * @param {string} className 
     */
    constructor(state, button, control, className) {
        this.state = state;
        this.button = button;
        this.control = control;

        this.displayed = false;

        // Create container, hide it.
        this._container = $('<div ></div>', {
            class: `hovering-window ${className}`,
            style: "display:none;",
        }).appendTo('body');
    }

    _show() {
        if (!this._container) {
            return;
        }

        // First, close any other search elements.
        this.state.setState("empty");

        // Construct element
        this.displayed = true;
        this._container.show();

        // Position ourselves!
        const offset = $(this.control).offset();
        var width = $(this.control).outerWidth() - 2;
        const height = this._container.height();
        var left = offset.left;
        var start = offset.top - (height + 2);

        const minWidth = this.minWidth;
        const minPadding = this.minPadding;
        if (this.callback && (width < minWidth)) {
            // We're popping over a hovering window, don't be too small.
            const delta = minWidth - width;

            width += delta;
            left -= delta;
        }

        if (this.callback && start < minPadding) {
            // We're popping over a hovering window and the top is cut off.
            start = offset.top + $(this.control).outerHeight();
        }

        if (this.callback && left < minPadding) {
            // We're popping over a hovering window and the left is cut off.
            left += (minPadding - left);
        }

        this._container.offset({top: start, left: left});
        this._container.width(width);

        this.didShow();
    }

    get minWidth() {
        return 250;
    }

    get minPadding() {
        return 5;
    }

    /**
     * Provides a way to programatically pop the window up attached to a control.
     * @param {*} newbutton_or_control 
     * @param {*} newcontrol 
     */
    show( newbutton_or_control, newcontrol ) {
        if (this.displayed) {
            this.hide();
        }

        if (newbutton_or_control || newcontrol) {
            this.reparent( newbutton_or_control, newcontrol );
        }

        this._show();
    }

    hide() {
        if (!this._container || !this.displayed) {
            return;
        }

        this.displayed = false;

        // Hide our top level.
        this._container.hide();

        this.didHide();
    }

    // Provide a way to reparent this control.
    reparent( newbutton_or_control, newcontrol ) {
        $(this.button).removeClass('hooked');
        $(this.button).off();

        if ( newcontrol ) {
            this.button = newbutton_or_control;
            this.control = newcontrol;
        } else {
            this.control = newbutton_or_control;
        }

        if (this.displayed) {
            this._show();
        }

        $(this.button).on('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            if (this.displayed) {
                this.hide();
            } else {
                this._show();
            }
        });
        $(this.button).addClass('hooked');
    }

    /** 
     * Provides a way to ask if a button is already bound to this control.
     */
    bound( button ) {
        return $(button).hasClass('hooked');
    }

    didHide() {
        // For subclasses
    }

    didShow() {
        // For subclasses
    }
}
