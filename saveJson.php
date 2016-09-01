<?php 
$arData = array(
	'status'=>'error',
	'message'=>'You can not save data to json',
	);
	//get data post
	$postString = file_get_contents("php://input");
	if($postString != "") {
		$_jsonInfo = json_decode($postString, true);
		if(isset($_jsonInfo['side_config']) && $_jsonInfo['side_config']) {
			$jsonContent = json_encode($_jsonInfo['side_config']); 
			if($jsonContent != '')
			{
				$jsonFolder = __DIR__ .'/assets/json/';
				if(!file_exists($jsonFolder))
				{
					mkdir($jsonFolder,777);
				}
				$fileName = 'customJson-'.time().'.json';
				try{
					$result = file_put_contents($jsonFolder . $fileName, $jsonContent);
					file_put_contents(__DIR__ .'/file_json.txt', $fileName);
					if($result)
					{
						$arData = array(
							'status'=>'success',
							'message'=>'File json is saved successfull',
						);
					}
				}
				Catch(Expection $e)
				{
					$arData['message'] = 'Cat not save json data, Akay!';
				}
			}
		}
	} 
echo json_encode($arData);
?>