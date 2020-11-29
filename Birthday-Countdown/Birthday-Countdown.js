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

deployWidget()
{
    let list = new ListWidget();
    list.setPadding(12, 12, 12, 12);

    let titleTxt = list.addText("🎂 My Birthday");
    titleTxt.font = Font.mediumSystemFont(13);

    list.addText("");

    let daysLeft = this.calculateDaysLeft();
    let daysLeftTxt = list.addText(daysLeft + " Days");
    daysLeftTxt.textColor = this.decideDisplayColor(daysLeft);
    daysLeftTxt.font = Font.boldSystemFont(24);

    list.addText("");

    let treeBottomLine = list.addText("LOL");
    treeBottomLine.font = Font.boldSystemFont(24);

    return list
}

