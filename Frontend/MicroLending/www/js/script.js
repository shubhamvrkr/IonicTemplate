

$(document).ready(function($) {
    // Script to allow only 6 characters for OTP Verification
    $("#otpnumber").keypress(function(e) {
        var maxChars = 6
        if (e.which < 0x20) {
            // e.which < 0x20, then it's not a printable character
            // e.which === 0 - Not a character
            return;     // Do nothing
        }
        if (this.value.length == maxChars) {
            e.preventDefault();
        } else if (this.value.length > maxChars) {
            // Maximum exceeded
            this.value = this.value.substring(0, maxChars);
        }
    });
});
