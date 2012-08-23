<h2>Add Item</h2>
<?=form_open_multipart($this->uri->segment(1).'/add/'.$format)?>
<fieldset>
	<ul>
		<li>
			<label>Facebook Page URL <span>(Required)</span></label>
			<?=form_input('facebook_page', set_value('facebook_page'))?>
			<?=form_error('facebook_page')?>
		</li>
		<li>
			<label>Quiz Title</label>
			<?=form_input('quiztitle', set_value('quiztitle'))?>
			<?=form_error('quiztitle')?>
		</li>
		<li>
			<label>Question 1</label>
			<textarea name="question1"></textarea>
		</li>
		<li>
			<label>Question 2</label>
			<textarea name="question2"></textarea>
		</li>
		<li>
			<label>Question 3</label>
			<textarea name="question3"></textarea>
		</li>
		<li>
			<label>Question 4</label>
			<textarea name="question4"></textarea>
		</li>
		<li>
			<label>Results</label>
			<textarea name="results"></textarea>
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
		<li>
			<label>Background Image</label>
			<input type="file" name="userfile" size="20" />
		</li>
		<li>
			<label>Background Color</label>
			<?=form_input('backgroundcolor', set_value('backgroundcolor'))?>
			<?=form_error('backgroundcolor')?>
		</li>
		<li>
			<label>Title Color</label>
			<?=form_input('titlecolor', set_value('titlecolor'))?>
			<?=form_error('titlecolor')?>
		</li>
		<li>
			<label>Link Color</label>
			<?=form_input('linkcolor', set_value('linkcolor'))?>
			<?=form_error('linkcolor')?>
		</li>
		
	</ul>
</fieldset>
<?=form_close()?>