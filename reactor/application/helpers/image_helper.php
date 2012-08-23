<?
		/** Upload Methods **/
	
	function manageFile($pName, $pTmpName, $pRestId, $target_path="./uploads"){
	
		//echo "<br/>File Name: ".$pName."</br>";	
		$file_name = basename($pName);
		$file_ext = substr(strrchr($file_name, '.'), 1);
	
		$target_name = $pRestId.'_'.date("U").'.'.$file_ext;
	
		if (move_uploaded_file($pTmpName, $target_path.$target_name)) {
			//echo "<br/>file moved";
			$imageData = copyimage($target_path.$target_name, $target_path.$target_name );
			$imageData['fileName'] = $target_name;
			//echo "<br/>file copied";
			//echo "<br/>The file ".basename($pName)." has been uploaded";
			//echo "imagedata: ";
			//print_r($imageData);
			return $imageData;
		} else {
			echo "There was an error uploading the file, please try again!";
			return "";
		}
	}
	
	function copyimage($name,$filename)
	{
		//echo "<br/>name: ".$name."<br/>";
		$system=explode(".",$name);
		//echo "system2: ".$system[count($system)-1]."<br/>";
		if (preg_match("/jpg|jpeg|JPG/",$system[count($system)-1])){$im=imagecreatefromjpeg($name);}
		if (preg_match("/png|PNG/",$system[count($system)-1])){$im=imagecreatefrompng($name);}
		if (preg_match("/gif|GIF/",$system[count($system)-1])){$im=imagecreatefromgif($name);}
		
		$result = array('width'=>imagesx($im),'height'=>imagesy($im),'fileName'=>$filename);

		if (preg_match("/png/",$system[count($system)-1])){
			imagepng($im,$filename); 
		}elseif (preg_match("/gif/",$system[count($system)-1])){
			imagegif($im,$filename); 
		} else {
			imagejpeg($im,$filename); 
		}
		imagedestroy($im); 
		
		return $result;
	}
	
	/*
		Function createthumb($name,$filename,$new_w,$new_h)
		creates a resized image
		variables:
		$name		Original filename
		$filename	Filename of the resized image
		$new_w		width of resized image
		$new_h		height of resized image
	*/	
	function createthumb($name,$filename,$new_w)
	{
		//echo "name: ".$name."<br/>";
		$system=explode(".",$name);
		//echo "system2: ".$system[count($system)-1]."<br/>";
		if (preg_match("/jpg|jpeg|JPG/",$system[count($system)-1])){$im=imagecreatefromjpeg($name);}
		if (preg_match("/png|PNG/",$system[count($system)-1])){$im=imagecreatefrompng($name);}
		
		list($width, $height) = array(imagesx($im),imagesy($im));
		    
	    // Get the scale based on the requested dimension
	    $scale = $width/$new_w;
	    
	    // X&Y scales remain the same because resizing will always be proportionate
	    $xscale=$scale;
	    $yscale=$scale;
	    
	    // Recalculate new size with default ratio
	    if ($yscale>$xscale){
	        $new_width = round($width * (1/$yscale));
	        $new_height = round($height * (1/$yscale));
	    }
	    else {
	        $new_width = round($width * (1/$xscale));
	        $new_height = round($height * (1/$xscale));
	    }
	
	    // Resize the original image
	    $imageResized = imagecreatetruecolor($new_width, $new_height);
	    imagealphablending( $imageResized, false );
		imagesavealpha( $imageResized, true );
	    
	    $imageTmp     = $im;
	    imagecopyresampled($imageResized, $imageTmp, 0, 0, 0, 0, $new_width, $new_height, $width, $height);
	
		
	/*	$old_x=imageSX($src_img);
		$old_y=imageSY($src_img);
		if ($old_x > $old_y) 
		{
			$thumb_w=$new_w;
			$thumb_h=$old_y*($new_h/$old_x);
		}
		if ($old_x < $old_y) 
		{
			$thumb_w=$old_x*($new_w/$old_y);
			$thumb_h=$new_h;
		}
		if ($old_x == $old_y) 
		{
			$thumb_w=$new_w;
			$thumb_h=$new_h;
		}
		$dst_img=ImageCreateTrueColor($thumb_w,$thumb_h);
		imagecopyresampled($dst_img,$src_img,0,0,0,0,$thumb_w,$thumb_h,$old_x,$old_y); */
		
		//echo "creating image: ".$system[count($system)-1]." sys1: ".$system[1]." filename: ".$filename;
		
		if (preg_match("/png/",$system[count($system)-1])){
			imagepng($imageResized,$filename); 
		} else {
			imagejpeg($imageResized,$filename); 
		}
		imagedestroy($im); 
		imagedestroy($imageResized);
		
		return true;
	}
	
?>