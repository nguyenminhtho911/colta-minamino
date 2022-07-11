"use strict";

if (!fc_defined("FCBase")) fc_define("FCBase");

FCBase.rss = {
	locale: "en-US", // ISO language code - http://www.lingoes.net/en/translator/langcode.htm
	path: "shared/rss/",
	file: "rss.php",
	// charset: "UTF-8",
	cors: true,
	async: false,
	data: [],
	callback: null
};

$.rssFeed = function(data, options) {
	var padNum = function(number) {
			return ("0" + number).slice(-2);
		};

	/*
	var options = $.extend({
			selector: null,
			url: null,
			page: 1,
			total: 5,
			maxTitle: 40,
			maxDesc: 100,
			endText: "...",
			noImage: "shared/img/shared/no-image.jpg"
		}, options);

	// console.log(data);
	*/

	// $.support.cors = FCBase.rss.cors; // fixed no transport error
	$.ajax({
		url: FCBase.rss.path + FCBase.rss.file,
		crossDomain: true,
		cache: false,
		async: FCBase.rss.async,
		method: "POST",
		dataType: "json",
		data: {
			data: JSON.stringify(data)
		},
		beforeSend: function(xhr) {
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			// if (options.charset) xhr.overrideMimeType("text/html;charset=" + options.charset);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(textStatus + ": " + errorThrown);

			return false;
		},
		success: function(json) {
			if (json.status == "success") {
				if (json.data && Object.keys(json.data).length > 0) {
					$.each(json.data, function(k, d) {
						if (d.status == "success" && d.data) {
							if (d.type == "xml") {
								var _counter_ = 0,
									_option_ = FCBase.rss.data[k],
									$elm = $(_option_.selector);

								if ($elm.length > 0) {
									var _feed_ = $.parseXML(d.data),
										$entries = false;

									if ($(_feed_).find("item").length > 0) $entries = $(_feed_).find("item");
									else if ($(_feed_).find("entry").length > 0) $entries = $(_feed_).find("entry");

									if ($entries) {
										$elm.empty(); // clear

										$entries.each(function(i) {
											if (_option_.total && _counter_ >= _option_.total) {
												if (_option_.callback && _option_.callback.constructor === Function) _option_.callback();

												return false;
											}

											var _title_ = false,
												_category_ = false,
												_date_ = false,
												_dateUTC_ = false,
												_year_ = false,
												_month_ = false,
												_monthLong_ = false,
												_monthShort_ = false,
												_weekdayLong_ = false,
												_weekdayShort_ = false,
												_day_ = false,
												_hour_ = false,
												_minute_ = false,
												_second_ = false,
												_author_ = false,
												_link_ = false,
												_description_ = false,
												_content_ = false,
												_thumbnail_ = false,
												_images_ = [],

												// elements
												$title = $("title", this),
												$category = $("category", this),
												$pubDate = $("pubDate", this),
												$modified = $("modified", this),
												$date = $("date", this),
												$dcDate = $("dc\\:date", this),
												$author = $("author", this),
												$creator = $("creator", this),
												$dcAuthor = $("dc\\:author", this),
												$dcCreator = $("dc\\:creator", this),
												$link = $("link", this),
												$guid = $("guid", this),
												$description = $("description", this),
												$content = $("content", this),
												$contentEncoded = $("content\\:encoded", this);



											if ($title.text()) {
												_title_ = $title.text();
												var _title_length_ = $title.text().length;
												if (_option_.maxTitle) { // limit
													_title_ = _title_.substring(0, _option_.maxTitle - 1);
													if (_option_.endText && (_option_.maxTitle < _title_length_)) _title_ += _option_.endText;
												}
											}

											if ($category.text()) _category_ = $category.text();

											if ($pubDate.text()) _dateUTC_ = $pubDate.text();
											else if ($modified.text()) _dateUTC_ = $modified.text();
											else if ($date.text()) _dateUTC_ = $date.text();
											else if ($dcDate.text()) _dateUTC_ = $dcDate.text();

											if (_dateUTC_) {
												var _dateParse_ = new Date(_dateUTC_);
												if (_dateParse_) {
													if (typeof Intl == "undefined") {
														var weekdays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"),
															months = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

														_year_ = _dateParse_.getUTCFullYear();
														_month_ = padNum(_dateParse_.getUTCMonth() + 1);
														_monthLong_ = months[_dateParse_.getUTCMonth()];
														_monthShort_ = _monthLong_ ? _monthLong_.substr(0, 3) : null;
														_day_ = padNum(_dateParse_.getUTCDate());
														_weekdayLong_ = weekdays[_dateParse_.getUTCDate()];
														_weekdayShort_ = _weekdayLong_ ? _weekdayLong_.substr(0, 3) : null;
														_hour_ = padNum(_dateParse_.getUTCHours());
														_minute_ = padNum(_dateParse_.getUTCMinutes());
														_second_ = padNum(_dateParse_.getUTCSeconds());
													}
													else { // https://caniuse.com/#feat=internationalization
														_year_ = new Intl.DateTimeFormat(FCBase.rss.locale, {year: "numeric"}).format(_dateParse_);
														_month_ = new Intl.DateTimeFormat(FCBase.rss.locale, {month: "2-digit"}).format(_dateParse_);
														_monthLong_ = new Intl.DateTimeFormat(FCBase.rss.locale, {month: "long"}).format(_dateParse_);
														_monthShort_ = new Intl.DateTimeFormat(FCBase.rss.locale, {month: "short"}).format(_dateParse_);
														_weekdayLong_ = new Intl.DateTimeFormat(FCBase.rss.locale, {weekday: "long"}).format(_dateParse_);
														_weekdayShort_ = new Intl.DateTimeFormat(FCBase.rss.locale, {weekday: "short"}).format(_dateParse_);
														_day_ = new Intl.DateTimeFormat(FCBase.rss.locale, {day: "2-digit"}).format(_dateParse_);
														_hour_ = new Intl.DateTimeFormat(FCBase.rss.locale, {hour: "2-digit"}).format(_dateParse_);
														_minute_ = new Intl.DateTimeFormat(FCBase.rss.locale, {minute: "2-digit"}).format(_dateParse_);
														_second_ = new Intl.DateTimeFormat(FCBase.rss.locale, {second: "2-digit"}).format(_dateParse_);
													}
												}
											}

											if ($author.text()) _author_ = $author.text();
											else if ($creator.text()) _author_ = $creator.text();
											else if ($author.text()) _author_ = $author.text();
											else if ($creator.text()) _author_ = $creator.text();

											if ($link.text()) _link_ = $link.text();
											else if ($link.attr("href").length > 0) _link_ = $link.attr("href");
											else if ($guid.text()) _link_ = $guid.text(); // wp permalink

											if ($description.text()) {
												_description_ = $description.text();
												_description_.replace(/\s+/g, "").replace(" ", ""); // remove whitespaces
												var _desc_length_ = _description_.length;
												if (_option_.maxDesc) { // limit
													_description_ = _description_.substring(0, _option_.maxDesc - 1);
													if (_option_.endText && (_option_.maxDesc < _desc_length_)) _description_ += _option_.endText;
												}
											}

											if ($content.text()) _content_ = $content.text();
											else if ($content.context && $content.context.textContent) _content_ = $content.context.textContent; // fixed for Edge
											else if ($contentEncoded.text()) _content_ = $contentEncoded.text();
											else if ($contentEncoded.context && $contentEncoded.context.textContent) _content_ = $contentEncoded.context.textContent; // fixed for Edge

											// Check ImageSize Exist
											if(typeof _option_.ImageSize == 'undefined'){

												_option_.ImageSize = {
													width: 300,
													height: 200
												}

											} else if(typeof _option_.noImage == 'undefined') { // Check noImage Exist

												_option_.noImage = 'https://via.placeholder.com/300x200.png?text=Test+No+Image';

												console.log('aaaaaa')

											}

											if (_content_) {
												var _html_ = $.parseHTML("<div>" + _content_ + "</div>"),
													$images = $(_html_).find("img");

												if ($(this).find("thumbnail").text()) {
													var imgSrc = $(this).find("thumbnail").text();
													_thumbnail_ = '<img src="' + imgSrc + '" alt="' + (_title_ ? _title_.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "") : "") + '">'; // only one thumbnail
													_images_.push(imgSrc);
												}

												$images.each(function() {
													var _src_ = $(this).attr("src");

													if (_src_ && !_src_.match("s.w.org")) {
														_images_.push(_src_);

														if (!_thumbnail_) _thumbnail_ = '<span style="display:block; background: url(' + _src_ + ') no-repeat center center; background-size:cover; width:' + _option_.ImageSize.width + 'px; height:' + _option_.ImageSize.height + 'px;"></span>'; // first
													}
												});

												if (!_thumbnail_ && _option_.noImage) _thumbnail_ = '<span style="display:block; background: url(' + _option_.noImage + ') no-repeat center center; background-size:cover; width:' + _option_.ImageSize.width + 'px; height:' + _option_.ImageSize.height + 'px;"></span>'; // no image
											}

											if (_title_ && !_title_.match("PR")) {
												var _output_ = _option_.template;

												_output_ =
													_output_
														.replace(/\{YEARS?\}/ig, (_year_ ? _year_ : ""))
														.replace(/\{MONTHS?\}/ig, (_month_ ? _month_ : ""))
														.replace(/\{DAYS?\}/ig, (_day_ ? _day_ : ""))
														.replace(/\{HOURS?\}/ig, (_hour_ ? _hour_ : ""))
														.replace(/\{MINUTES?\}/ig, (_minute_ ? _minute_ : ""))
														.replace(/\{SECONDS?\}/ig, (_second_ ? _second_ : ""))
														.replace(/\{MONTHS?-LONG\}/ig, (_monthLong_ ? _monthLong_ : ""))
														.replace(/\{MONTHS?-SHORT\}/ig, (_monthShort_ ? _monthShort_ : ""))
														.replace(/\{WEEKDAYS?-LONG\}/ig, (_weekdayLong_ ? _weekdayLong_ : ""))
														.replace(/\{WEEKDAYS?-SHORT\}/ig, (_weekdayShort_ ? _weekdayShort_ : ""))
														.replace(/\{DATE\}/ig, ((_year_ && _month_ && _day_) ? (_year_ + "-" + _month_ + "-" + _day_) : ""))
														.replace(/\{TIME\}/ig, ((_hour_ && _minute_ && _second_) ? (_hour_ + ":" + _minute_ + ":" + _second_) : ""))
														.replace(/\{(URL|LINK|PERMALINK)\}/ig, (_link_ ? _link_ : ""))
														.replace(/\{(USERS?|AUTHORS?|CREATOR)\}/ig, (_author_ ? _author_ : ""))
														.replace(/\{(CAT|CATEGORY|CATEGORIES)\}/ig, (_category_ ? _category_ : ""))
														.replace(/\{(TITLE|NAME)\}/ig, (_title_ ? _title_ : ""))
														.replace(/\{(DESC|DESCRIPTION)\}/ig, (_description_ ? _description_ : ""))
														.replace(/\{(CONTENT|POST|DETAIL)S?\}/ig, (_content_ ? _content_ : ""))
														.replace(/\{(IMG|IMAGE|PHOTO|THUMB|THUMBNAIL)S?\}/ig, (_thumbnail_ ? _thumbnail_ : ""));

												$(_option_.selector).append(_output_); // insert to screen

												_counter_++;
											}

											if (i >= $entries.length - 1) { // ended
												if (_option_.callback && _option_.callback.constructor === Function) _option_.callback();
											}
										});
									}
									else console.info("No results found");
								}
								else console.error(_option_.selector, "element does not exist");
							}
						}
						else console.error(d.http_code, d.request_url + "\n" + d.message);
					});
				}
				else console.error(json.message); // missing data-response
			}
			else console.error(json.message);
		}
	})
	.done(function() {
		if (FCBase.rss.callback && FCBase.rss.callback.constructor === Function) callback.call(this);
	});
};

$(document).ready(function() {
	var _data_ = {};

	$.each(FCBase.rss.data, function(idx, rss) {
		var uid = Math.random().toString(36).substring(3);

		if (rss.selector) {
			if ($(rss.selector).length > 0) {
				_data_[uid] = {
					key: uid,
					url: rss.url,
					page: rss.page
				};

				FCBase.rss.data[uid] = rss;
				delete FCBase.rss.data[idx];
			}
			else console.error(rss.selector, "element does not exist");
		}
		else console.error("Missing `selector`");
	});

	$.rssFeed(_data_);
});