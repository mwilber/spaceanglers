<div id="addedit" class="dialog">
</div>

<a href="<?=base_url()?><?=$this->uri->segment(1);?>/add" class="button" style="float:left; margin-right:5px;">Add Item</a>
<a href="<?=base_url()?><?=$this->uri->segment(1);?>/csv" class="button" style="float:left; margin-right:5px;">Export CSV</a>
<a href="http://www.facebook.com/dialog/pagetab?app_id=326891344050712&next=http://www.facebook.com" class="button" style="float:left; clear:right;">Install App</a>

<?if($this->session->flashdata('flashError')):?>
<div class='flashError'>
	Error! <?=$this->session->flashdata('flashError')?>
</div>
<?endif?>

<?if($this->session->flashdata('flashConfirm')):?>
<div class='flashConfirm'>
	Success! <?=$this->session->flashdata('flashConfirm')?>
</div>
<?endif?>

<strong  style="float:left; clear:both;">Total Records: <?=$total_rows?></strong>

<table border="1" cellpadding="4" style="float:left; clear:both;">
	<tr>
		<th width="100">FBID</th>
		<th width="100">Quiz Title</th>
		<th width="100">Question 1</th>
		<th width="100">Question 2</th>
		<th width="100">Question 3</th>
		<th width="100">Question 4</th>
		<th width="100">Results</th>
		<th width="100">Bkg Image</th>
		<th width="100">Bkg Color</th>
		<th width="100">Title Color</th>
		<th width="100">Link Color</th>
		<th width="100">Links</th>
		<th width="100"></th>
		<th width="100"></th>
	</tr>
	<?if(isset($records) && is_array($records) && count($records)>0):?>
		<?foreach($records as $record):?>
		<tr>
			<td><a href="http://apps.facebook.com/gzfive_rss/tab.php?c=<?=$record->facebook_page?>"><?=$record->facebook_page?></a></td>
			<td><?=$record->quiztitle?></td>
			<td><?=$record->question1?></td>
			<td><?=$record->question2?></td>
			<td><?=$record->question3?></td>
			<td><?=$record->question4?></td>
			<td><?=$record->results?></td>
			<td><img src="<?=$record->backgroundimage?>" width="100"/></td>
			<td bgcolor="#<?=$record->backgroundcolor?>"><?=$record->backgroundcolor?></td>
			<td bgcolor="#<?=$record->titlecolor?>"><?=$record->titlecolor?></td>
			<td bgcolor="#<?=$record->linkcolor?>"><?=$record->linkcolor?></td><br/>
			<td>
				<a href="http://apps.facebook.com/gzfive_rss/tab.php?c=<?=$record->facebook_page?>">Preview</a><br/>
				<a href='<?=base_url()?><?=$this->uri->segment(1);?>/dumpconfig/<?=$record->$pk?>'>Get Conf</a>
			</td>
			<td><a href='<?=base_url()?><?=$this->uri->segment(1);?>/edit/<?=$record->$pk?>'>Edit</a></td>
			<td><a href='<?=base_url()?><?=$this->uri->segment(1);?>/delete/<?=$record->$pk?>'>Delete</a></td>
		</tr>
		<?endforeach?>
	<?else:?>
		<tr>
			<td colspan="3">There are currently no records.</td>
		</tr>
	<?endif?>
</table>