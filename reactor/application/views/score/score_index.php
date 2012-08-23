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
		<th width="100">Score Number</th>
		<th width="100">Score Name</th>
		<th width="100">Time Stamp</th>
		<th width="100"></th>
		<th width="100"></th>
	</tr>
	<?if(isset($records) && is_array($records) && count($records)>0):?>
		<?foreach($records as $record):?>
		<tr>
			<td><?=$record->scoreNumber?></td>
			<td><?=$record->scoreName?></td>
			<td><?=$record->scoreTimeStamp?></td>
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