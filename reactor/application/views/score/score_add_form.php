<h2>Add Item</h2>
<?=form_open_multipart($this->uri->segment(1).'/add/'.$format)?>
<fieldset>
	<ul>
		<li>
			<label>Number <span>(Required)</span></label>
			<?=form_input('scoreNumber', set_value('scoreNumber'))?>
			<?=form_error('scoreNumber')?>
		</li>
		<li>
			<label>Name</label>
			<?=form_input('scoreName', set_value('scoreName'))?>
			<?=form_error('scoreName')?>
		</li>
		<li>
			<input type="submit" value="Save" name="" class="button">
		</li>
	</ul>
	<ul>
		<!--<li>
			<label>Photo URL</label>
			<?=form_input('photo_url', set_value('photo_url'))?>
			<?=form_error('photo_url')?>
		</li>
		<li>
			<label>Thumb URL</label>
			<?=form_input('thumb_url', set_value('thumb_url'))?>
			<?=form_error('thumb_url')?>
		</li>-->
		
	</ul>
</fieldset>
<?=form_close()?>