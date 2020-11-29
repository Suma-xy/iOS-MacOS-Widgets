// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: birthday-cake;
// Version 0.0.1

class BirthdayCountdown
{
    run()
    {
        let widget = this.deployWidget();
        if (!config.runsInWidget) {
            widget.presentSmall();
        }
        Script.setWidget(widget);
        Script.complete();
    }
	
}
