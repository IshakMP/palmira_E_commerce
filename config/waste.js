var $button = $(this);
var oldValue = $button.parent().find("input").val();
if ($button.hasClass("inc")) {
  qty = 1;
} else {
  qty = -1;
}
$button.parent().find("input").val(newVal);
