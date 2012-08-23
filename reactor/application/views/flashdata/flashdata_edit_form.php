<div id="editmast">
	<strong>EDIT ITEM</strong>
	<h2><?=$record->quiztitle?></h2>
</div>
<? $hidden = array('ID' => $record->flashDataId); ?>
<?=form_open($this->uri->segment(1).'/edit/'.$record->flashDataId, '', $hidden)?>
<fieldset>
	<ul>
		<li>
			<label>Facebook Page URL <span>(Required)</span></label>
			<?=form_input('facebook_page', set_value('facebook_page', $record->facebook_page))?>
			<?=form_error('facebook_page')?>
		</li>
		<li>
			<label>Quiz Title</label>
			<?=form_input('quiztitle', set_value('quiztitle', $record->quiztitle))?>
			<?=form_error('quiztitle')?>
		</li>
		<li>
			<label>Question 1</label>
			<textarea name="question1"><?= $record->question1 ?></textarea>
		</li>
		<li>
			<label>Question 2</label>
			<textarea name="question2"><?= $record->question2 ?></textarea>
		</li>
		<li>
			<label>Question 3</label>
			<textarea name="question3"><?= $record->question3 ?></textarea>
		</li>
		<li>
			<label>Question 4</label>
			<textarea name="question4"><?= $record->question4 ?></textarea>
		</li>
		<li>
			<label>Results</label>
			<textarea name="results"><?= $record->results ?></textarea>
		</li>
		<li>
			<input type="submit" value="Save" name="" class="button">
		</li>
	</ul>
	<ul>
		<li>
			<label>Background Image</label>
			<?=form_input('backgroundimage', set_value('backgroundimage', $record->backgroundimage))?>
			<?=form_error('backgroundimage')?>
		</li>
		<li>
			<label>Background Color</label>
			<?=form_input('backgroundcolor', set_value('backgroundcolor', $record->backgroundcolor))?>
			<?=form_error('backgroundcolor')?>
		</li>
		<li>
			<label>Title Color</label>
			<?=form_input('titlecolor', set_value('titlecolor', $record->titlecolor))?>
			<?=form_error('titlecolor')?>
		</li>
		<li>
			<label>Link Color</label>
			<?=form_input('linkcolor', set_value('linkcolor', $record->linkcolor))?>
			<?=form_error('linkcolor')?>
		</li>
	</ul>
</fieldset>
<?=form_close()?>