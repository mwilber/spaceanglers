<?if(isset($records) && is_array($records) && count($records)>0):?>
	<ol>
		<?foreach($records as $record):?>
		<li><span><?=$record->scoreNumber?></span> - <?=$record->scoreName?></li>
		<?endforeach?>
	</ol>
<?else:?>
	<ul>
		<li>There are currently no records.</li>
	</ul>
<?endif;?>