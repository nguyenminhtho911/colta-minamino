<?php
/*******************************************************************************************
 *
 * Script: RSS
 * Package: Core
 * Version: 1.3
 *
 * FoodConnection
 * http://foodconnection.vn/
 * http://foodconnection.jp/
 *
 *******************************************************************************************
 *
 * ------------------- DON'T EDIT BELOW IF YOU DON'T UNDERSTAND ABOUT IT -------------------
 *
 *******************************************************************************************/

if (!defined ("FC-RSS")) exit;

function request_url_contents(&$uri) {
	$GLOBALS["_response_header_"] = NULL;
	do {
		$context = stream_context_create(array(
			"http" => array(
				"follow_location" => FALSE
			)
		));

		$result = file_get_contents($uri, FALSE, $context);

		$pattern = "/^Location:\s*(.*)$/i";
		$location_headers = preg_grep($pattern, $http_response_header);

		if (!empty($location_headers)) {
			$arr = array_values($location_headers);
			if (preg_match($pattern, $arr[0], $matches)) {
				$uri = $matches[1];
				$repeat = TRUE;
			}
		}
		else {
			$repeat = FALSE;

			$GLOBALS["_response_header_"] = $http_response_header;
		}
	}
	while ($repeat);

	return $result;
}

function is_xml($content) {
	$content = trim($content);

	if (empty($content) || stripos($content, "<!DOCTYPE html>") !== FALSE) return FALSE;

	libxml_use_internal_errors(TRUE);
	simplexml_load_string($content);
	$errors = libxml_get_errors();
	libxml_clear_errors();

	return empty($errors);
}

function followLocation($url, &$max = NULL) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HEADER, TRUE);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, FALSE);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	$result = curl_exec($ch);
	$httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);

	if ($httpStatus < 300 || $httpStatus >= 400) return $url;

	if (preg_match("/Location: (.*)/i", $result, $match)) {
		$location = trim($match[1]);

		if (preg_match("/^\/(.*)/", $location)) {
			$urlParts = parse_url($url);

			if ($urlParts["scheme"]) $baseURL = $urlParts["scheme"]."://";
			if ($urlParts["host"]) $baseURL .= $urlParts["host"];
			if ($urlParts["port"]) $baseURL .= ":".$urlParts["port"];

			return $baseURL.$location;
		}

		if ($max) $max--;

		return $location;
	}

	return $url;
}

if (!function_exists("apache_get_version")){
	function apache_get_version(){
		if (!isset($_SERVER["SERVER_SOFTWARE"]) || strlen($_SERVER["SERVER_SOFTWARE"]) == 0) return FALSE;

		return $_SERVER["SERVER_SOFTWARE"];
	}
}

$json = array(
	"status" => "error",
	"message" => "An error occurred",
	"script" => array(
		"namespace" => "RSS",
		"version" => "1.3"
	)
);



$cURL_installed = extension_loaded("curl");
// $cURL_installed = FALSE;
// $cURL_installed = TRUE;
$cURL_version = $cURL_installed ? curl_version() : FALSE;

$maxRedirects = $maxRedirects ? $maxRedirects : 5;

$postData = NULL;
if (!empty($_SERVER["HTTP_X_REQUESTED_WITH"]) && strtolower($_SERVER["HTTP_X_REQUESTED_WITH"]) == "xmlhttprequest" && isset($_POST["data"])) $postData = json_decode($_POST["data"], TRUE);
// $postData = '[{"key":"vnpck571dd","url":1,"page":1},{"key":"it1ck571dd","url":2,"page":1}]'; // TODO: page param - wp: ?p=
// $postData = '[{"key":"vnpck571dd","url":1,"page":1}]';

@ini_set("safe_mode", FALSE);
@ini_set("open_basedir", NULL);
$followLocation = ini_get("safe_mode") == "" || strtolower(ini_get("safe_mode")) == "off" || ini_get("open_basedir") ? FALSE : TRUE;

$doRun = FALSE;
$debugMode = FALSE;
if (isset($_GET["debug"]) && strlen($_GET["debug"]) > 0) {
	error_reporting(E_ALL);
	ini_set("display_errors", TRUE);

	$debugMode = strtolower($_GET["debug"]);
	if ($debugMode == "url") {
		$json["status"] = "success";
		$json["message"] = "Debug URLs";
		$json["data"] = $_url;
		$json["total"] = count($_url);
	}
	elseif ($debugMode == "check") {
		$phpversion = phpversion();

		$headers = array(
			"From" => "noreply@example.com",
			"Content-Type" => "text/html; charset=ISO-8859-1",
			"MIME-Version" => "1.0",
			"X-Priority" => "1",
			"X-Mailer" => "PHP/".$phpversion
		);

		$mail = FALSE;
		// if (@mail("nobody@example.com", "Subject", "Test mail", $headers)) $mail = TRUE;

		$json["status"] = "success";
		$json["message"] = "Debug check";
		$json["config"] = array(
			"timeout" => $timeout,
			"connect_timeout" => $connectTimeout,
			"max_redirects" => $maxRedirects,
			"version_ssl" => $versionSSL
		);
		$json["data"] = array(
			"cURL" => $cURL_version,
			"mail" => $mail,
			"allow_url_fopen" => (bool) ini_get("allow_url_fopen"),
			"file_get_contents" => function_exists("file_get_contents"),
			"server_software" => $_SERVER["SERVER_SOFTWARE"],
			"apache_version" => apache_get_version(),
			"php_version" => $phpversion,
			"follow_location" => $followLocation
		);
	}
	elseif ($debugMode == "test") {
		if (isset($_GET["url"]) && strlen($_GET["url"]) > 0) {
			$postData = array();
			$urls = str_replace(";", ",", $_GET["url"]);
			$arr = explode(",", $urls);
			if (count($arr) > 0) { 
				foreach ($arr as $u) {
					$postData[] = array(
						"key" => substr(sha1(rand()), 0, 10), // random uid
						"url" => $u
					);
				}
			}
		}
		else $json["message"] = "[url] is missing or invalid";
	}
	else $json["message"] = "Invalid debug mode";

	$json["debug"] = $debugMode;
}



if (is_array($postData) && count($postData) > 0) {
	$preData = array();
	foreach ($postData as $p) {
		if (isset($p["key"])) {
			if (isset($p["url"]) && isset($_url[$p["url"]])) {
				$uri = $_url[$p["url"]];
				if (!$followLocation) $uri = followLocation($uri);

				$preData[$p["key"]] = $uri;
				$doRun = TRUE;
			}
			else $preData[$p["key"]] = FALSE;
		}
		else $preData[$p["key"]] = NULL;
	}



	if ($doRun) {
		$totalTime = 0;
		$data = array();
		foreach ($preData as $k => $u) {
			// assign key
			$data[$k] = array(
				"status" => "error",
				"message" => $u ? "An error occurred" : "URL not exists",
				"type" => NULL,
				"data" => NULL
			);
		}

		if ($cURL_installed) {
			@set_time_limit(0);

			$options = array(
				CURLOPT_TIMEOUT => $timeout, // timeout on response
				CURLOPT_CONNECTTIMEOUT => $connectTimeout, // timeout on connect
				CURLOPT_MAXREDIRS => $maxRedirects, // stop after 10 redirects 
				CURLOPT_USERAGENT => $_SERVER["HTTP_USER_AGENT"],
				CURLOPT_ENCODING => NULL,
				CURLOPT_HEADER => FALSE, // don't return headers
				CURLOPT_SSL_VERIFYHOST => FALSE,
				CURLOPT_SSL_VERIFYPEER => FALSE,
				CURLOPT_FRESH_CONNECT => FALSE,
				CURLOPT_COOKIESESSION => TRUE,
				CURLOPT_VERBOSE => TRUE,
				CURLOPT_FAILONERROR => TRUE,
				CURLOPT_AUTOREFERER => TRUE, // set referer on redirect
				CURLOPT_RETURNTRANSFER => TRUE, // return web page
				CURLOPT_FOLLOWLOCATION => $followLocation, // follow redirects
				CURLOPT_CUSTOMREQUEST => "GET"
			);

			if (!defined("CURL_SSLVERSION_DEFAULT")) define("CURL_SSLVERSION_DEFAULT", 0);
			if (!defined("CURL_SSLVERSION_TLSv1")) define("CURL_SSLVERSION_TLSv1", 1);
			if (!defined("CURL_SSLVERSION_SSLv2")) define("CURL_SSLVERSION_SSLv2", 2);
			if (!defined("CURL_SSLVERSION_SSLv3")) define("CURL_SSLVERSION_SSLv3", 3);
			if (!defined("CURL_SSLVERSION_TLSv1_0")) define("CURL_SSLVERSION_TLSv1_0", 4);
			if (!defined("CURL_SSLVERSION_TLSv1_1")) define("CURL_SSLVERSION_TLSv1_1", 5);
			if (!defined("CURL_SSLVERSION_TLSv1_2")) define("CURL_SSLVERSION_TLSv1_2", 6);

			$listSSL = array(
				CURL_SSLVERSION_DEFAULT,
				CURL_SSLVERSION_TLSv1,
				CURL_SSLVERSION_SSLv2,
				CURL_SSLVERSION_SSLv3,
				CURL_SSLVERSION_TLSv1_0,
				CURL_SSLVERSION_TLSv1_1,
				CURL_SSLVERSION_TLSv1_2
			);
			if (is_numeric($versionSSL) && isset($listSSL[$versionSSL])) $options[CURLOPT_SSLVERSION] = $listSSL[$versionSSL];

			$requests = array();
			$requestHandler = curl_multi_init(); // cURL multi-handle
			foreach ($preData as $k => $u) {
				if ($u) {
					$requests[$k] = curl_init($u); // initialized

					curl_setopt_array($requests[$k], $options); // options

					curl_multi_add_handle($requestHandler, $requests[$k]); // add to handle
				}
				else {
					$data[$k]["message"] = "Invalid url";
					$data[$k]["request_url"] = $u;
				}
			}

			if (count($requests) > 0) {
				$running = NULL;
				if (version_compare($cURL_version["version"], "7.24", ">=")) { // https://bugs.php.net/bug.php?id=61141
					do { // start
						$resource = curl_multi_exec($requestHandler, $running);
					}
					while ($resource == CURLM_CALL_MULTI_PERFORM);

					// loop & continue processing the request
					while ($running && $resource == CURLM_OK) {
						if (curl_multi_select($requestHandler) == -1) usleep(100); // wait - solve CPU 100% usage

						do {
							$resource = curl_multi_exec($requestHandler, $running);
						}
						while ($resource == CURLM_CALL_MULTI_PERFORM);
					}
				}
				else {
					do {
						$resource = curl_multi_exec($requestHandler, $running); // execute the handle
					}
					while ($running > 0);
				}

				// response
				foreach ($requests as $k => $req) {
					$content = curl_multi_getcontent($req);
					$http_code = curl_getinfo($req, CURLINFO_HTTP_CODE);
					$response_time = curl_getinfo($req, CURLINFO_TOTAL_TIME);
					$effective_url = curl_getinfo($req, CURLINFO_EFFECTIVE_URL);

					$arr = array(
						"status" => "error",
						"message" => "An error occurred",
						"type" => NULL,
						"data" => NULL,
						"http_code" => $http_code,
						"response_time" => $response_time,
						"request_url" => $preData[$k],
						"effective_url" => $effective_url
					);

					$totalTime += $response_time;

					if (curl_errno($req) || !$content) {
						$arr["message"] = curl_error($req);
						$arr["data"] = curl_getinfo($req);
					}
					else {
						$arr["status"] = "success";
						$arr["message"] = "Loaded";
						$arr["type"] = is_xml($content) ? "xml" : "plain";
						$arr["data"] = $content;
					}

					$data[$k] = $arr; // re-assign

					// close handle
					curl_multi_remove_handle($requestHandler, $req);
					curl_close($req);
				}
			}

			curl_multi_close($requestHandler);
		}
		else {
			$GLOBALS["_response_header_"] = NULL;
			$GLOBALS["_request_errors_"] = NULL;
			set_error_handler(
				function ($severity, $message, $file, $line) {
					$GLOBALS["_request_errors_"] = $message;
				}
			);

			foreach ($preData as $k => $u) {
				if (ini_get("allow_url_fopen") && function_exists("file_get_contents")) {
					$data[$k]["request_url"] = $u;

					if ($u) {
						$start = microtime(TRUE);
						$content = request_url_contents($u); // extends for $u
						$end = microtime(TRUE);

						$response_time = round($end - $start, 3);

						if ($content) {
							$data[$k]["status"] = "success";
							$data[$k]["message"] = "Loaded";
							$data[$k]["type"] = is_xml($content) ? "xml" : "plain";
							$data[$k]["data"] = $content;
							$data[$k]["http_code"] = 0;
							$data[$k]["effective_url"] = $u;

							if (is_array($GLOBALS["_response_header_"])) {
								$parts = explode(" ", $GLOBALS["_response_header_"][0]);  // HTTP/1.0 <code> <text>
								if (count($parts) > 1) $data[$k]["http_code"] = intval($parts[1]);
							}

							$GLOBALS["_response_header_"] = NULL; // reset for response header
						}
						else {
							$data[$k]["message"] = $GLOBALS["_request_errors_"];
							$GLOBALS["_request_errors_"] = NULL; // reset for request errors
						}
					}
					else $json["message"] = "Invalid url";

					$data[$k]["response_time"] = $response_time;

					$totalTime += $response_time;

					usleep(500000); // .5 second
				}
			}

			restore_error_handler();
		}

		$json["status"] = "success";
		$json["data"] = $data;
		$json["totalTime"] = round($totalTime, 3);
	}
}
elseif (!$debugMode) $json["message"] = "Invalid data format";

$result = json_encode($json, JSON_HEX_APOS);
if ($debugMode) $result = htmlspecialchars($result, ENT_QUOTES, "UTF-8");

echo $result;