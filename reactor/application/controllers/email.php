<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Email extends CI_Controller
{
	
	function index($pLimit = "")
	{
		// Set WHERE params for SQL SELECT
		$selectOpts = array('sortBy'=>'emailTime','sortDirection'=>'DESC');
		// Limit result set. Mainly used by xml output
		if( $pLimit != "" ){
			$selectOpts['offset'] = '0';
			$selectOpts['limit'] = $pLimit;
		}
		
		$this->load->model('emaildata_model');
	    
		$data['total_rows'] = $this->emaildata_model->Get(array('count' => true));
		$data['records'] = $this->emaildata_model->Get($selectOpts);
		$data['fields'] = $this->emaildata_model->_fields();
		$data['pk'] = $this->emaildata_model->_pk();
		
		if( $this->session->userdata('userEmail') ){
			$this->load->view('template/template_head');
			$this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_index', $data);
			$this->load->view('template/template_foot');
		}else{
			redirect('welcome/login');
		}
	}
	
	function add()
	{
		$this->load->view('template/template_head');
	    $this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_add_form');
		$this->load->view('template/template_foot');
	}
	
	function share()
	{
		$this->load->view('template/template_head');
	    $this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_add_share_form');
		$this->load->view('template/template_foot');
	}
	
	function notify(){
		if( $this->session->userdata('userEmail') ){
			$json = '{"mc_gross":"5.00","protection_eligibility":"Ineligible","payer_id":"LY7MFKT8AE6GG","tax":"0.00","payment_date":"06:36:41 May 28, 2012 PDT","payment_status":"Completed","charset":"windows-1252","first_name":"Matthew","mc_fee":"0.45","notify_version":"3.4","custom":"102352989996","payer_status":"unverified","business":"ttam999@yahoo.com","quantity":"1","verify_sign":"ANTj00p5Ns4jMicp.Ts8epjWE0.uAdgBG820hn-eRxxyxyX13k-uM..g","payer_email":"mwilber@gmail.com","txn_id":"05T91619UW485964M","payment_type":"instant","btn_id":"46445535","last_name":"Wilber","receiver_email":"ttam999@yahoo.com","payment_fee":"0.45","shipping_discount":"0.00","insurance_amount":"0.00","receiver_id":"W7XNFUALLFQQW","txn_type":"web_accept","item_name":"GZ5 Quiz","discount":"0.00","mc_currency":"USD","item_number":"gz5quiz","residence_country":"US","receipt_id":"3714-9031-6239-3157","handling_amount":"0.00","shipping_method":"Default","transaction_subject":"102352989996","payment_gross":"5.00","shipping":"0.00","ipn_track_id":"d77eb0ed6a3d3"}';
			$data['formfields'] = json_decode($json);
			
			
			$this->load->view('template/template_head');
		    $this->load->view($this->uri->segment(1).'/'.$this->uri->segment(1).'_test_form', $data);
			$this->load->view('template/template_foot');
		}else{
			redirect('welcome/login');
		}
	}
	
	function sendmail($mailtemplate = "share")
	{	
		$toEmail = $_POST['toEmail'];
		$toName = "";
		if(isset($_POST['toName'])){
			$toName = $_POST['toName'];
		}
		$fromEmail = $_POST['fromEmail'];
		$fromName = $_POST['fromName'];
		$fromName = $_POST['fromName'];
		
		if( $toName != "" ){
			$toName = "Hi ".$toName.",";
		}
		
		$message = "";
		if( isset($_POST['message']) ){
			if( $_POST['message'] != "" && $_POST['message'] != "null" ){
				$message = $_POST['message'];	
			}
		}
		
		$this->load->model('emaildata_model');
		
		$docc = false;
		$optout = 0;
		
		// Build the html email
		$emailBody="";

		$file = fopen("email_templates/".$mailtemplate.".html", "r");

		while(!feof($file)) {
		    //read file line by line into variable
			$emailBody = $emailBody . fgets($file, 4096);
		}
		fclose ($file);
		
		// Fill in dynamic values
		$arrFind = array("{TONAME}", "{FROMNAME}", "{MESSAGE}", "{TOMAIL}", "{FROMMAIL}");
		$arrReplace = array($toName, $fromName, $message, $toEmail, $fromEmail);
		$emailBody = str_replace($arrFind, $arrReplace, $emailBody);
		
		// Send html email
		$this->load->library('email');
		$config['charset'] = 'iso-8859-1';
		$config['mailtype'] = 'html';
		$this->email->initialize($config);
		
		$this->email->from($fromEmail, $fromName);
		$this->email->to($toEmail, $toName);
		if( $docc ){
			$this->email->bcc($fromEmail); 
		}
		
		//(Recipient�s name), (Sender�s name) sent you a Pawtrait!
		$this->email->subject('Take a ride on the Click 3X Holiday Shred Sled!');
		
		$this->email->message($emailBody);
		
		// Store data if email was sent successfully
		if( $this->email->send() ){
			//$this->emaildata->setData($toEmail, $toName, $fromEmail, $fromName, $message, $filename, $flashdata, $optout);
			$nId = $this->emaildata_model->Add($_POST);
			echo "success";
		}else{
			echo $this->email->print_debugger();
		}
		
		
	}

}