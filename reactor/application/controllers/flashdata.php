<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class FlashData extends CI_Controller
{
	var $requiredfield = "quiztitle";
	
	// Create
	function add($pFormat="html")
	{
		$this->load->model('flashdata_model');
		
		$data['format'] = $pFormat;
		
	    // Validate form
	    $this->form_validation->set_rules($this->requiredfield, 'name', 'trim|required');
	    
	    if($this->form_validation->run())
	    {
			$tokens = explode('/', $_POST['facebook_page']);
			$fbid = $tokens[sizeof($tokens)-1];
			if( $fbid == "" ){
				$fbid = $tokens[sizeof($tokens)-2];
			}

			$fbprof = file_get_contents('https://graph.facebook.com/'.$fbid);
			$jfbprof = json_decode($fbprof);
			//print_r($jfbprof);
			$_POST['facebook_page'] = $jfbprof->id;
			
	    	// Process images here
	    	if($_FILES['userfile']){
				$imageData = $this->flashdata_model->manageFile($_POST['facebook_page']);
				
				$this->load->library('s3');
				
				$_POST['backgroundimage'] = $this->s3->upload($this->config->item('upload_dir').$imageData['upload_data']['file_name'], $imageData['upload_data']['file_name']);
				//print_r($_POST);
				//return;
			}
			
	        // Validation passes
	        $nId = $this->flashdata_model->Add($_POST);
	        
			if($pFormat == "html"){
				if($nId)
		        {
		            $this->session->set_flashdata('flashConfirm', 'The item has been successfully added.');
		           redirect($this->uri->segment(1));
		        }
		        else
		        {
	                $this->session->set_flashdata('flashError', 'A database error has occured, please contact your administrator.');
		            redirect($this->uri->segment(1));
		        }
			}elseif($pFormat == "xml"){
				// TODO: see if we can redirect with flash
				//redirect($this->uri->segment(1)."/details/xml/".$nId);
				
				$this->details("xml", $nId);
			}
	    }else{
	    	$this->load->view('template/template_head');
		    $this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_add_form', $data);
			$this->load->view('template/template_foot');	
	    }
	}
	
    // Retrieve
	function index($pFormat="html")
	{
		$this->load->model('flashdata_model');
	    
		$data['total_rows'] = $this->flashdata_model->Get(array('count' => true));
		$data['records'] = $this->flashdata_model->Get(array('sortBy'=>'flashDataTimestamp','sortDirection'=>'DESC'));
		$data['fields'] = $this->flashdata_model->_fields();
		$data['pk'] = $this->flashdata_model->_pk();
		
		if($pFormat == "html"){
			if( $this->session->userdata('userEmail') ){
				$this->load->view('template/template_head');
				$this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_index', $data);
				$this->load->view('template/template_foot');
			}else{
				redirect('welcome/login');
			}
			
		}elseif($pFormat == "xml"){
			$this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_index_xml', $data);
		}
		
		
	}
	
	function build($recordId){
		$this->load->model('flashdata_model');
		$record = $this->flashdata_model->Get(array($this->flashdata_model->_pk() => $recordId));
	    if(!$record) redirect($this->uri->segment(1));
		
		// Build the config file
		$configContent="";

		$file = fopen("../configs/default.php", "r");

		while(!feof($file)) {
		    //read file line by line into variable
			$configContent = $configContent . fgets($file, 4096);
		}
		fclose ($file);
		
		// Fill in dynamic values
		$arrFind = array("{siteurl}", "{rssurl}", "{rsstitle}", "{backgroundimage}", "{backgroundcolor}", "{titlecolor}", "{linkcolor}");
		$arrReplace = array($record->siteurl, $record->rssurl, $record->rsstitle, $record->backgroundimage, $record->backgroundcolor, $record->titlecolor, $record->linkcolor);
		$configContent = str_replace($arrFind, $arrReplace, $configContent);
		// Write out the file
		$configFile = "../configs/".$record->facebook_page.".php";
		$fh = fopen($configFile, 'w') or die("can't open file");
		fwrite($fh, $configContent);
		fclose($fh);
		
		redirect($this->uri->segment(1));
	}

	function getconfig($recordId){
		$this->load->model('flashdata_model');
		$record = $this->flashdata_model->Get(array('facebook_page' => $recordId));
	    if(!$record) redirect($this->uri->segment(1));
		
		$record = $record[0];
		
		// Build the config file
		$configContent="";

		$file = fopen("../configs/default.php", "r");

		while(!feof($file)) {
		    //read file line by line into variable
			$configContent = $configContent . fgets($file, 4096);
		}
		fclose ($file);
		
		// Fill in dynamic values
		$arrFind = array("{siteurl}", "{rssurl}", "{rsstitle}", "{backgroundimage}", "{backgroundcolor}", "{titlecolor}", "{linkcolor}");
		$arrReplace = array($record->siteurl, $record->rssurl, $record->rsstitle, $record->backgroundimage, $record->backgroundcolor, $record->titlecolor, $record->linkcolor);
		$configContent = str_replace($arrFind, $arrReplace, $configContent);
		
		header("Content-type: text/php");
		header("Content-Disposition: attachment; filename=".$record->facebook_page.".php");
		header("Pragma: no-cache");
		header("Expires: 0");
		print "$configContent";
	}

	function dumpconfig($recordId){
		$this->load->model('flashdata_model');
		$record = $this->flashdata_model->Get(array($this->flashdata_model->_pk() => $recordId));
	    if(!$record) redirect($this->uri->segment(1));
		
		// Build the config file
		$configContent="";

		$file = fopen("../configs/".$record->facebook_page.".php", "r");

		while(!feof($file)) {
		    //read file line by line into variable
			$configContent = $configContent . fgets($file, 4096);
		}
		fclose ($file);
		
		header("Content-type: application/octet-stream");
		header("Content-Disposition: attachment; filename=".$record->facebook_page.".php");
		header("Pragma: no-cache");
		header("Expires: 0");
		print "$configContent";
	}
	
	function csv($pFormat="html")
	{
		$this->load->model('flashdata_model');
	    
		$data['total_rows'] = $this->flashdata_model->Get(array('count' => true));
		$data['records'] = $this->flashdata_model->Get(array('sortBy'=>'flashDataTimestamp','sortDirection'=>'ACS'));
		$data['fields'] = $this->flashdata_model->_fields();
		$data['pk'] = $this->flashdata_model->_pk();
		
		$header = "";
		$filedata = "";
		foreach($data['records'][0] as $name=> $value)
		{
		    $header .= $name . "\t";
		}
		
		foreach($data['records'] as $row)
		{
		    $line = '';
		    foreach( $row as $value )
		    {                                            
		        if ( ( !isset( $value ) ) || ( $value == "" ) )
		        {
		            $value = "\t";
		        }
		        else
		        {
		            $value = str_replace( '"' , '""' , $value );
		            $value = '"' . $value . '"' . "\t";
		        }
		        $line .= $value;
		    }
		    $filedata .= trim( $line ) . "\n";
		}
		$filedata = str_replace( "\r" , "" , $filedata );
		
		if ( $filedata == "" )
		{
		    $filedata = "\n(0) Records Found!\n";                        
		}
		
		header("Content-type: application/octet-stream");
		header("Content-Disposition: attachment; filename=".$this->uri->segment(1)."_export.xls");
		header("Pragma: no-cache");
		header("Expires: 0");
		print "$header\n$filedata";
				
		
		
	}
	
	 // Retrieve
	function recordcount($pFormat="html")
	{
		$this->load->model('flashdata_model');
	    
		$data['total_rows'] = $this->flashdata_model->Get(array('count' => true));
		$data['fields'] = $this->flashdata_model->_fields();
		$data['pk'] = $this->flashdata_model->_pk();
		
		if($pFormat == "html"){
			//$this->load->view('template/template_head');
			//$this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_index', $data);
			//$this->load->view('template/template_foot');
			redirect($this->uri->segment(1));
		}elseif($pFormat == "xml"){
			$this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_count_xml', $data);
		}
		
		
	}
	
	function paginated($offset = 0)
	{
		$this->load->model('flashdata_model');
	    $this->load->library('pagination');
	    
	    $perpage = 10;
		
	    $config['base_url'] = base_url() . $this->uri->segment(1).'/index/';
	    $config['total_rows'] = $this->flashdata_model->Get(array('count' => true));
	    $config['per_page'] = $perpage;
	    $config['uri_segment'] = 3;
	    
	    $this->pagination->initialize($config);
	    
	    $data['pagination'] = $this->pagination->create_links();
	    
		$data[$this->uri->segment(1)] = $this->flashdata_model->Get(array('sortBy'=>'order','sortDirection'=>'ASC','limit' => $perpage, 'offset' => $offset));
		$data['fields'] = $this->flashdata_model->_fields();
		$data['pk'] = $this->flashdata_model->_pk();
		
		$this->load->view('template/template_head');
		$this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_paginated', $data);
		$this->load->view('template/template_foot');
		
	}
	
	function details($pFormat="html", $pId){
		$this->load->model('flashdata_model');
		
		$data['record'] = $this->flashdata_model->Get(array('flashDataId'=>$pId));
		
		$this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_details_xml', $data);
		$data['fields'] = $this->flashdata_model->_fields();
		$data['pk'] = $this->flashdata_model->_pk();
	}
	
	// Update
	function edit($recordId)
	{
		$this->load->model('flashdata_model');
		$data['record'] = $this->flashdata_model->Get(array($this->flashdata_model->_pk() => $recordId));
	    if(!$data['record']) redirect($this->uri->segment(1));
		
		// Validate form
	    $this->form_validation->set_rules($this->requiredfield, 'name', 'trim|required');
	    
	    if($this->form_validation->run())
		{
	        // Validation passes
	        $_POST[$this->flashdata_model->_pk()] = $recordId;
	        
	        if($this->flashdata_model->Update($_POST))
	        {
	            $this->session->set_flashdata('flashConfirm', 'The user has been successfully updated.');
	            redirect($this->uri->segment(1));
	        }
	        else
	        {
                $this->session->set_flashdata('flashError', 'A database error has occured, please contact your administrator.');
	            redirect($this->uri->segment(1));
	        }
	    }
		
		$this->load->view('template/template_head');
		$this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_edit_form', $data);
		$this->load->view('template/template_foot');
	}
	
	// Delete
	function delete($recordId)
	{
		$this->load->model('flashdata_model');
	    $data['record'] = $this->flashdata_model->Get(array($this->flashdata_model->_pk() => $recordId));
	    if(!$data['record']) redirect($this->uri->segment(1));
	    
	    $this->flashdata_model->Delete($recordId);
	    
	    $this->session->set_flashdata('flashConfirm', 'The user has been successfully deleted.');
	    redirect($this->uri->segment(1));
	}
	
	
	function GoBuild($pFormat="html")
	{
		$output = new stdClass();
		
		$output->error = "-1";
		$output->message = "unknown";
		
		$this->load->model('flashdata_model');
		
		$data['format'] = $pFormat;
		
	    // Validate form
	    $this->form_validation->set_rules($this->requiredfield, 'name', 'trim|required');
	    
	    if($this->form_validation->run())
	    {
			if (strpos($_POST['facebook_page'], '/') !== false) {
				$tokens = explode('/', $_POST['facebook_page']);
				$fbid = $tokens[sizeof($tokens)-1];
				if( $fbid == "" ){
					$fbid = $tokens[sizeof($tokens)-2];
				}
			}else{
				$fbid = $_POST['facebook_page'];
			}
			
			$_POST['facebook_page'] = "";
			
			try{
				$fbprof = file_get_contents('https://graph.facebook.com/'.$fbid);
				$jfbprof = json_decode($fbprof);
			}catch(Exception $e){
				$jfbprof = new stdClass();
			}
			
			
			//print_r($jfbprof);

			if( isset($jfbprof->id) ){
				if( !isset($jfbprof->first_name) ){
				
					$_POST['facebook_page'] = $jfbprof->id;
					
			    	// Process images here
			    	$_POST['backgroundimage'] = "";
			    	if(isset($_FILES['userfile'])){
						$imageData = $this->flashdata_model->manageFile($_POST['facebook_page']);
					}
					if( !isset($imageData['error']) ){

						if(isset($imageData['upload_data']['file_name'])){
							$this->load->library('s3');
							$_POST['backgroundimage'] = $this->s3->upload($this->config->item('upload_dir').$imageData['upload_data']['file_name'], $imageData['upload_data']['file_name']);
							//print_r($_POST);
							//return;
						}
					
						unset($_POST['userfile']);
						
						// Clean up the questions
						for($i=1; $i<=4; $i++){
							for($j=1; $j<=4; $j++){
								if( $_POST["answer$i$j"] != "" ){
									$_POST["question$i"] .= "|";
									if($_POST["correct$i"] == $j) $_POST["question$i"] .= "*";
									$_POST["question$i"] .= $_POST["answer$i$j"];
								}
								unset($_POST["answer$i$j"]);
							}
							unset($_POST["correct$i"]);
						}
						
						for($i=0; $i<=4; $i++){
			
							$_POST["results"] .= "|".$_POST["result$i"];
							unset($_POST["result$i"]);
						}
						
				        // Validation passes
				        $nId = 0;
				        // Check for an existing record
				        $tmpRec = $this->flashdata_model->Get(array('facebook_page'=>$_POST['facebook_page']));
						if( count($tmpRec) > 0 ){
							$nId = $tmpRec[0]->flashDataId;
							$_POST[$this->flashdata_model->_pk()] = $nId;
							$this->flashdata_model->Update($_POST);
						}else{
							$nId = $this->flashdata_model->Add($_POST);	
						}
				        
						if($nId)
				        {
				           //echo 'success';
							$output->error = "0";
							$output->message = "success";
							$output->fbid = $_POST['facebook_page'];
				        }else{
			                //echo  'A database error has occured';
			                $output->error = "-2";
							$output->message = "A database error has occured";
				        }
					}else{
		        		$output->error = "-5";
						$output->message = $imageData['error'];
		        	}
		        }else{
		        	$output->error = "-4";
					$output->message = "Facebook apps can only be installed on public pages, not user profiles.";
		        }
				
			}else{
				$output->error = "-4";
				$output->message = "Could not find the facebook page.";
			}

	    }else{
	    	//echo 'validation error';
	    	$output->error = "-3";
			$output->message = "Quiz Title is required.";
	    }
		header('Content-Type: application/json'); 
		echo json_encode($output);
	}
}