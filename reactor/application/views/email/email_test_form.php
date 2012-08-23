<h2>Send Test Email</h2>
<form action="http://dev.mwilber.com/notify.php" method="post">
<fieldset>
	<ul>
		<?php foreach ($formfields as $key => $value): ?>
			<li>
				<label><?=$key?></label>
				<input name="<?=$key?>" value="<?=$value?>"/>
			</li>
		<?php endforeach; ?>
		<input type="submit"/>
	</ul>
</fieldset>
</form>