<return_xml>
	<item>
		<id><?php echo $record->flashDataId; ?></id>
		<facebook_id><?php echo $record->facebook_id; ?></facebook_id>
		<user_name><?php echo $record->user_name; ?></user_name>
		<comment><?php echo $record->comment; ?></comment>
		<photo_url><?=base_url()?>uploads/<?php echo $record->photo_url; ?></photo_url>
		<thumb_url><?=base_url()?>uploads/<?php echo $record->thumb_url; ?></thumb_url>
		<post_date><?php echo $record->post_date; ?></post_date>
	</item>
</return_xml>
