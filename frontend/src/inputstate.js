/** @typedef {"search" | "empty" | "chat" | "info" | "menu" | "typeahead"} InputStateValue */

export function InputState() {
    this.current = "empty";
    this.callbacks = [];

    this.registerStateChangeCallback = function(callback) {
        this.callbacks.push(callback);
    }

    /**
     * Transition into a new state, execute state change callbacks.
     * @param {InputStateValue} newState 
     */
    this.setState = function(newState) {
        const changed = this.current != newState;
        this.current = newState;

        if (changed) {
            this.callbacks.forEach(function(callback) {
                callback(newState);
            });
        }
    }
}
