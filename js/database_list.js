$(function () {
	$.getJSON("json/database_list.json", function (data) {
		console.log(data);

		// TODAY'S DATE
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1;
		var yyyy = today.getFullYear();
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		todaysDate = yyyy + "-" + mm + "-" + dd;
		//alert(todaysDate);

		// END TODAY'S DATE
		var k = 0;
		var kcore = 0;
		//alert("# of databases = " + data.databases.length);
		$("#dblist").text();
		$("#dblist").append("<h2>Databases:");
		$("#dblist").append("<div id='resultscore'></div><dl id='core'>");
		$("#dblist").append("<div id='results'></div><dl id='comp'>");
		// BUILD LIST = ALL ACTIVE

		let tagsVendor = new Set();
		let tagsContent = new Set();
		let tagsSubject = new Set();
		let tagsSort = new Set();

		for (h = 0; h < data.databases.length; h++) {
			// tags_content
			if (data.databases[h].tags_content.length) {
				for (l = 0; l < data.databases[h].tags_content.length; l++) {
					tagsContent.add(data.databases[h].tags_content[l]);

				}
			}
			// tags_subject
			if (data.databases[h].tags_subject.length) {
				for (l = 0; l < data.databases[h].tags_subject.length; l++) {
					tagsSubject.add(data.databases[h].tags_subject[l]);
				}
			}

			// tags_vendor
			if (((data.databases[h].status === "Active") || (data.databases[h].status === "Trial" && data.databases[h].dates[0] < todaysDate && data.databases[h].dates[1] > todaysDate)) && data.databases[h].tags_vendor.length) {
				for (l = 0; l < data.databases[h].tags_vendor.length; l++) {
					tagsVendor.add(data.databases[h].tags_vendor[l]);
				}
			}
			// tags_sort

			if (data.databases[h].tags_sort.length && data.databases[h].tags_sort[0].length) {
				for (l = 0; l < data.databases[h].tags_sort.length; l++) {
					tagsSort.add(data.databases[h].tags_sort[l]);
				}
			}
		}
		function search_content(s_content) {
			$("#dblist dl").html("");
			// alert(s_alpha + " " + s_content + " " + s_subject + " " + s_sort);

			for (i = 0; i < data.databases.length; i++) {
				s_content = s_content.replace("\'", '&#39;');
				//alert(s_content.replace("\'", '&39;'));
				if (((data.databases[i].status === "Active") || (data.databases[i].status === "Trial" && data.databases[i].dates[0] < todaysDate && data.databases[i].dates[1] > todaysDate)) && (data.databases[i].tags_content.includes(s_content))) { // .replace(/\<[\s\S]*?\>\'/g, '')

					build();
				} else if (((data.databases[i].status === "Active") || (data.databases[i].status === "Trial" && data.databases[i].dates[0] < todaysDate && data.databases[i].dates[1] > todaysDate)) && ((data.databases[i].tags_subject.includes(s_content)) || data.databases[i].tags_subject.includes(s_content + "-CORE"))) {

					if ((data.databases[i].tags_subject.includes(s_content)) || data.databases[i].tags_subject.includes(s_content + "-CORE")) {
						//alert(s_content)
						build();
					}
					//console.log(s_content);
					if (data.databases[i].tags_subject.includes(s_content + "-CORE")) {
						//alert(s_content + "-CORE");
						buildCore();
					}

				} else if (((data.databases[i].status === "Active") || (data.databases[i].status === "Trial" && data.databases[i].dates[0] < todaysDate && data.databases[i].dates[1] > todaysDate)) && (data.databases[i].tags_vendor.includes(s_content))) {

					//console.log(s_content);
					build();
				} else if (((data.databases[i].status === "Active") || (data.databases[i].status === "Trial" && data.databases[i].dates[0] < todaysDate && data.databases[i].dates[1] > todaysDate)) && (data.databases[i].name.charAt(0).toUpperCase() == (s_content))) {
					build();
				} else if (((data.databases[i].status === "Active") || (data.databases[i].status === "Trial" && data.databases[i].dates[0] < todaysDate && data.databases[i].dates[1] > todaysDate)) && (data.databases[i].tags_sort.includes(s_content))) {
					build();
				} else if (((data.databases[i].status === "Active") || (data.databases[i].status === "Trial" && data.databases[i].dates[0] < todaysDate && data.databases[i].dates[1] > todaysDate)) && s_content === "All") {
					build();
				}

				function build() {
					var dbname = data.databases[i].name;
					if (dbname.includes("<abbr") || dbname.includes("<span")) {
						var dbname2 = dbname.replace(/\<[\s\S]*?\>/g, '');
						//console.log(dbname2);
					} else {
						dbname2 = dbname;
					}
					var dbid = dbname2.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
					// CREATE ENTRY FUNCTION
					function desc() {
						$("#dblist dl#comp div#" + dbid).append("<dd class='short'>" + data.databases[i].description_short + " (<button class='button' id='button-" + dbid + "' aria-controls='target-" + dbid + "'><span class='plus-minus'> + </span> <span class='visually-hidden'><span class='view-hide'>Show </span> details about " + dbname2 + "</span>" + "</button>) <span class='icon-container'>");
						$("#dblist dl#comp div#" + dbid).append("<dd><div id='target-" + dbid + "' class='toggle' role='tabpanel'><span class='moreabout'>More about <span class='moreabouttitle'>" + data.databases[i].name + ": </span></span><ul>");

						for (j = 0; j < data.databases[i].tags_content.length; j++) {
							var icon = data.databases[i].tags_content[j].replace(/\s/g, '').toLowerCase();
							$("#" + dbid + " .icon-container").append("<span class='show-tags icon-" + icon + " ' title='" + data.databases[i].tags_content[j] + "'> " + data.databases[i].tags_content[j] + "</span> ");
						}
						// tags_vendor
						if (data.databases[i].tags_vendor.length) {
							$("#dblist dl#comp div#" + dbid + " ul").append("<li><span class='key'> Vendor: </span><span class='vendors'></span> ");
							for (l = 0; l < data.databases[i].tags_vendor.length; l++) {
								$("#dblist dl#comp div#" + dbid + " .vendors").append("<span>" + data.databases[i].tags_vendor[l] + ", </span> ");
							}
						}
						// tags_vendor_extended
						if (data.databases[i].tags_vendor_extended.length && data.databases[i].tags_vendor_extended[0].length) {
							$("#dblist dl#comp div#" + dbid + " li span.vendors").append(" <span class='vendors_extended'></span> ");
							for (l = 0; l < data.databases[i].tags_vendor_extended.length; l++) {
								$("#dblist dl#comp div#" + dbid + " span.vendors span.vendors_extended").append("<span>" + data.databases[i].tags_vendor_extended[l] + ", </span> ");
							}
						}
						if (data.databases[i].description_long) {
							$("#dblist dl#comp div#" + dbid + " ul").append("<li><span class='key'> Long Description: </span>" + data.databases[i].description_long);
						}
						// name_alt

						if (data.databases[i].name_alt) {
							$("#dblist dl#comp div#" + dbid + " ul").append("<li><span class='key'> Alternative Names: </span>" + data.databases[i].name_alt);
						}

						// note
						if (data.databases[i].note) {
							$("#dblist dl#comp div#" + dbid + " ul").append("<li><span class='key'> Note: </span>" + data.databases[i].note);
						}
						// coverage
						if (data.databases[i].coverage) {
							$("#dblist dl#comp div#" + dbid + " ul").append("<li><span class='key'> Coverage: </span>" + data.databases[i].coverage);
						}
						// sources
						if (data.databases[i].sources) {
							$("#dblist dl#comp div#" + dbid + " ul").append("<li><span class='key'> Sources: </span>" + data.databases[i].sources);
						}
						// topics
						if (data.databases[i].topics) {
							$("#dblist dl#comp div#" + dbid + " ul").append("<li><span class='key'> Topics Covered: </span>" + data.databases[i].topics);
						}

						// tags_content
						$("#dblist dl#comp div#" + dbid + " ul").append("<li><span class='key'> Tags: </span><span class='tags'></span> ");

						if (data.databases[i].tags_content.length) {
							for (l = 0; l < data.databases[i].tags_content.length; l++) {
								//tagsContent.add(data.databases[i].tags_content[l]);
								//tagsContent.sort();
								$("#dblist dl#comp div#" + dbid + " .tags").append("<span>" + data.databases[i].tags_content[l] + ", </span> ");
							}
						}
						// tags_subject
						if (data.databases[i].tags_subject.length) {
							//$("#dblist dl#comp div#" + dbid).append("<dd class='toggle'><span class='key'> Vendor: </span><span class='vendors'></span> ");
							for (l = 0; l < data.databases[i].tags_subject.length; l++) {


								//tagsSubject.add(data.databases[i].tags_subject[l]);
								//tagsSubject.sort();
								$("#dblist dl#comp div#" + dbid + " ul  .tags").append("<span>" + data.databases[i].tags_subject[l] + ", </span> ");
							}
						}
						// tags_sort
						if (data.databases[i].tags_sort.length && data.databases[i].tags_sort[0].length) {
							//$("#dblist dl#comp div#" + dbid).append("<dd class='toggle'><span class='key'> Vendor: </span><span class='vendors'></span> ");
							for (l = 0; l < data.databases[i].tags_sort.length; l++) {
								//tagsSort.add(data.databases[i].tags_sort[l]);
								// tagsSort.sort();
								$("#dblist dl#comp div#" + dbid + " ul .tags").append("<span>" + data.databases[i].tags_sort[l] + ", </span> ");
							}
						}
						// access
						if (data.databases[i].access) {
							$("#dblist dl#comp div#" + dbid + " ul").append("<li><span class='key'> Access: </span>" + data.databases[i].access);
						}
						// access_limits
						if (data.databases[i].access_limits) {
							$("#dblist dl#comp div#" + dbid + " ul").append("<li><span class='key'> Access Limits: </span>" + data.databases[i].access_limits);
						}
						// access_note
						if (data.databases[i].access_note) {
							$("#dblist dl#comp div#" + dbid + " ul").append("<li><span class='key'> Access Note: </span>" + data.databases[i].access_note);
						}
					} // END CREATE ENTRY FUNCTION

					// CREATE LINK
					if (!data.databases[i].link.length) {
						$("#dblist dl#comp").append("<div role='tablist' id='" + dbid + "'><dt><span class='dbname'>" + data.databases[i].name);
						j++;
						desc();
					} else {

						if (data.databases[i].proxy === "true") {
							$("#dblist dl#comp").append("<div role='tablist' id='" + dbid + "'><dt><span class='dbname'><a href='" + data.proxy_prefix + data.databases[i].link + "'>" + data.databases[i].name);
							k++;
							desc();
						} else {
							$("#dblist dl#comp").append("<div role='tablist' id='" + dbid + "'><dt><span class='dbname'><a href='" + data.databases[i].link + "'>" + data.databases[i].name);
							k++;
							desc();
						}
					}
					if (data.databases[i].status === "Trial") {
						$("#dblist dl#comp #" + dbid + " .dbname").append(" (" + data.databases[i].status + " ends on " + data.databases[i].dates[1] + ")")
					}
					// END CREATE LINK
				}
				function buildCore() {
					var dbname = data.databases[i].name;
					if (dbname.includes("<abbr") || dbname.includes("<span")) {
						var dbname2 = dbname.replace(/\<[\s\S]*?\>/g, '');
						//console.log(dbname2);
					} else {
						dbname2 = dbname;
					}
					var dbid = dbname2.replace(/[^A-Z0-9]+/ig, "").toLowerCase();
					// CREATE ENTRY FUNCTION
					function desc() {
						$("#dblist dl#core div#" + dbid + "2").append("<dd class='short'>" + data.databases[i].description_short + " (<button class='button' id='button-" + dbid + "2' aria-controls='target-" + dbid + "2'><span class='plus-minus'> + </span> <span class='visually-hidden'><span class='view-hide'>Show </span> details about " + dbname2 + "</span>" + "</button>) <span class='icon-container'>");
						$("#dblist dl#core div#" + dbid + "2").append("<dd><div id='target-" + dbid + "2' class='toggle' role='tabpanel'><span class='moreabout'>More about <span class='moreabouttitle'>" + data.databases[i].name + ": </span></span><ul>");


						for (j = 0; j < data.databases[i].tags_content.length; j++) {
							var icon = data.databases[i].tags_content[j].replace(/\s/g, '').toLowerCase();
							$("#" + dbid + "2 .icon-container").append("<span class='show-tags icon-" + icon + " ' title='" + data.databases[i].tags_content[j] + "'> " + data.databases[i].tags_content[j] + "</span> ");
						}
						// tags_vendor
						if (data.databases[i].tags_vendor.length) {
							$("#dblist dl#core div#" + dbid + "2 ul").append("<li><span class='key'> Vendor: </span><span class='vendors'></span> ");
							for (l = 0; l < data.databases[i].tags_vendor.length; l++) {
								$("#dblist dl#core div#" + dbid + "2 .vendors").append("<span>" + data.databases[i].tags_vendor[l] + ", </span> ");
							}
						}
						// tags_vendor_extended
						if (data.databases[i].tags_vendor_extended.length && data.databases[i].tags_vendor_extended[0].length) {
							$("#dblist dl#core div#" + dbid + "2 li span.vendors").append(" <span class='vendors_extended'></span> ");
							for (l = 0; l < data.databases[i].tags_vendor_extended.length; l++) {
								$("#dblist dl#core div#" + dbid + "2 span.vendors span.vendors_extended").append("<span>" + data.databases[i].tags_vendor_extended[l] + ", </span> ");
							}
						}
						if (data.databases[i].description_long) {
							$("#dblist dl#core div#" + dbid + "2 ul").append("<li><span class='key'> Long Description: </span>" + data.databases[i].description_long);
						}
						// name_alt

						if (data.databases[i].name_alt) {
							$("#dblist dl#core div#" + dbid + "2 ul").append("<li><span class='key'> Alternative Names: </span>" + data.databases[i].name_alt);
						}

						// note
						if (data.databases[i].note) {
							$("#dblist dl#core div#" + dbid + "2 ul").append("<li><span class='key'> Note: </span>" + data.databases[i].note);
						}
						// coverage
						if (data.databases[i].coverage) {
							$("#dblist dl#core div#" + dbid + "2 ul").append("<li><span class='key'> Coverage: </span>" + data.databases[i].coverage);
						}
						// sources
						if (data.databases[i].sources) {
							$("#dblist dl#core div#" + dbid + "2 ul").append("<li><span class='key'> Sources: </span>" + data.databases[i].sources);
						}
						// topics
						if (data.databases[i].topics) {
							$("#dblist dl#core div#" + dbid + "2 ul").append("<li><span class='key'> Topics Covered: </span>" + data.databases[i].topics);
						}

						// tags_content
						$("#dblist dl#core div#" + dbid + "2 ul").append("<li><span class='key'> Tags: </span><span class='tags'></span> ");

						if (data.databases[i].tags_content.length) {
							for (l = 0; l < data.databases[i].tags_content.length; l++) {
								//tagsContent.add(data.databases[i].tags_content[l]);
								//tagsContent.sort();
								$("#dblist dl#core div#" + dbid + "2 .tags").append("<span>" + data.databases[i].tags_content[l] + ", </span> ");
							}
						}
						// tags_subject
						if (data.databases[i].tags_subject.length) {
							//$("#dblist dl#core div#" + dbid + "2").append("<dd class='toggle'><span class='key'> Vendor: </span><span class='vendors'></span> ");
							for (l = 0; l < data.databases[i].tags_subject.length; l++) {


								//tagsSubject.add(data.databases[i].tags_subject[l]);
								//tagsSubject.sort();
								$("#dblist dl#core div#" + dbid + "2 ul  .tags").append("<span>" + data.databases[i].tags_subject[l] + ", </span> ");
							}
						}
						// tags_sort

						if (data.databases[i].tags_sort.length && data.databases[i].tags_sort[0].length) {
							//$("#dblist dl#core div#" + dbid).append("<dd class='toggle'><span class='key'> Vendor: </span><span class='vendors'></span> ");
							for (l = 0; l < data.databases[i].tags_sort.length; l++) {
								//tagsSort.add(data.databases[i].tags_sort[l]);
								// tagsSort.sort();
								$("#dblist dl#core div#" + dbid + "2 ul .tags").append("<span>" + data.databases[i].tags_sort[l] + ", </span> ");
							}
						}
						// access
						if (data.databases[i].access) {
							$("#dblist dl#core div#" + dbid + "2 ul").append("<li><span class='key'> Access: </span>" + data.databases[i].access);
						}
						// access_limits
						if (data.databases[i].access_limits) {
							$("#dblist dl#core div#" + dbid + "2 ul").append("<li><span class='key'> Access Limits: </span>" + data.databases[i].access_limits);
						}
						// access_note
						if (data.databases[i].access_note) {
							$("#dblist dl#core div#" + dbid + "2 ul").append("<li><span class='key'> Access Note: </span>" + data.databases[i].access_note);
						}

					} // END CREATE ENTRY FUNCTION

					// CREATE LINK
					if (!data.databases[i].link.length) {
						$("#dblist dl#core").append("<div role='tablist' id='" + dbid + "2'><dt><span class='dbname'>" + data.databases[i].name);
						j++;
						desc();
					} else {

						if (data.databases[i].proxy === "true") {
							$("#dblist dl#core").append("<div role='tablist' id='" + dbid + "2'><dt><span class='dbname'><a href='" + data.proxy_prefix + data.databases[i].link + "'>" + data.databases[i].name);
							kcore++;
							desc();
						} else {
							$("#dblist dl#core").append("<div role='tablist' id='" + dbid + "2'><dt><span class='dbname'><a href='" + data.databases[i].link + "'>" + data.databases[i].name);
							kcore++;
							desc();
						}
					}
					if (data.databases[i].status === "Trial") {
						$("#dblist dl#core #" + dbid + "2 .dbname").append(" (" + data.databases[i].status + " ends on " + data.databases[i].dates[1] + ")")
					}

					// END CREATE LINK
				}
			}

			// $("#dblist dl").before("<div id='results'>");
			$("#results").text("");
			$("#results").append("<p>Found <b>" + k + "</b> results in <q><i>" + s_content + "</i>.</q>");
			$("#resultscore").text("");
			if (kcore != 0) {
				$("#resultscore").append("<h3>Core " + s_content + "</h3><p>Found <b>" + kcore + "</b> results in <q><i>" + s_content + " Core</i>.</q> Start with these:");
				$("#results").prepend("<h3>Comprehensive " + s_content + "</h3>");
				$("#results p").append(" Explore further with these:");
			}
			// TOGGLE FUNCTION START
			$(".toggle").attr({
				"aria-expanded": "false"
			});
			$(".button").attr({
				"tabindex": "0",
				"role": "tab"
			}).on("click", function () {
				if (!$(this).attr("aria-selected")) {
					$(this).attr("aria-selected", "true");
					$(this).children(".plus-minus").text(" - ");
					$(this).find(".view-hide").text(" Hide ");
					$(this).parent().siblings(".toggle").attr({
						"aria-expanded": "true"
					});
				} else if ($(this).attr("aria-selected") === "true") {
					$(this).attr("aria-selected", "false");
					$(this).children(".plus-minus").text(" + ");
					$(this).find(".view-hide").text(" Show ");
					$(this).parent().siblings(".toggle").attr({
						"aria-expanded": "false"
					});
				} else if ($(this).attr("aria-selected") === "false") {
					$(this).attr("aria-selected", "true");
					$(this).children(".plus-minus").text(" - ");
					$(this).find(".view-hide").text(" Hide ");
					$(this).parent().siblings(".toggle").attr({
						"aria-expanded": "true"
					});
				}
				var target = $(this).attr("id").replace("button-", "");
				//alert(target);
				$("div#" + target + " .toggle").toggle();

			});
			// TOGGLE FUNCTION END          
		}

		// $("#dblist").prepend("<p>Found " + k + " results:");
		// END BUILD LIST
		// START BUILD SEARCH AND SORT OPTIONS
		$("aside#options").prepend("<div id=search_options>");
		$("#search_options").append("<h2>Sort Options:</h2>");

		// alpha drop down
		$("#search_options")
		$("#search_options").append("<form id='alpha_options'><label for='sort_alpha'>Alphabetical: </label><select id='sort_alpha'><option value='All'>All: A-Z</option>");
		//set the default value of aa & zz to print A to Z
		var aa = 65;
		var zz = 91;
		//loop through the values from aa to zz
		for (z = aa; z < zz; z++) {
			//convert the char code to string (Alphabets)
			var alpha = String.fromCharCode(z);
			//print the result in console
			$("#sort_alpha").append("<option value='" + alpha + "'>" + alpha);
			//console.log(alpha);
		}
		//$("#sort_alpha").append("<option value='All'> All");
		$("#alpha_options").append(" <button class='sort'>Sort</button>");

		// content type options
		$("#search_options").append("<form id='content_options'><label for='sort_content'>Content Type: </label><select id='sort_content'><option value='All'>All Content Types</option>");
		let tagsContentArray = [...tagsContent].sort(function (a, b) {
			return a.toLowerCase().localeCompare(b.toLowerCase());
		});
		console.log(tagsContentArray);
		console.log(tagsContentArray.length);
		for (n = 0; n < tagsContentArray.length; n++) {
			if (!tagsContentArray[n]) {} else {

				var tagsContentArrayId = tagsContentArray[n].replace(/\s/g, '').toLowerCase();
				//$("#sort_content").append("<option value='" + tagsContentArrayId + "'>" + tagsContentArray[n]);
				$("#sort_content").append("<option value='" + tagsContentArray[n] + "'>" + tagsContentArray[n]);
			}
		}
		$("#content_options").append(" <button class='sort'>Sort</button>");

		// subject options
		$("#search_options").append("<form id='subject_options'><label for='sort_subject'>Subject: </label><select id='sort_subject'><option value='All'>All Subject</option>");
		let tagsSubjectArray = [...tagsSubject].sort();
		console.log(tagsSubjectArray);
		console.log(tagsSubjectArray.length);
		for (n = 0; n < tagsSubjectArray.length; n++) {
			if (!tagsSubjectArray[n]) { //do nothing
			} else if (tagsSubjectArray[n].includes("-CORE")) { //do nothing
			} else {

				//var tagsSubjectArrayId = tagsSubjectArray[n].replace(/\s|'/g, '').toLowerCase();
				var tagsSubjectArrayId = tagsSubjectArray[n].replace(/'/g, ''); //.toLowerCase();
				//$("#sort_subject").append("<option value='" + tagsSubjectArrayId + "'>" + tagsSubjectArray[n]);
				$("#sort_subject").append("<option value='" + tagsSubjectArrayId + "'>" + tagsSubjectArray[n]);
			}
		}
		$("#subject_options").append(" <button class='sort'>Sort</button>");

		// vendor options

		$("#search_options").append("<form id='vendor_options'><label for='sort_vendor'>Vendor: </label><select id='sort_vendor'><option value='All'>All Vendors</option>");
		let tagsVendorArray = [...tagsVendor].sort(function (a, b) {
			return a.toLowerCase().localeCompare(b.toLowerCase());
		});
		console.log(tagsVendorArray);
		console.log(tagsVendorArray.length);
		for (n = 0; n < tagsVendorArray.length; n++) {
			if (!tagsVendorArray[n]) {} else {

				var tagsVendorArrayId = tagsVendorArray[n].replace(/\s/g, '').toLowerCase();
				//$("#sort_vendor").append("<option value='" + tagsVendorArrayId + "'>" + tagsVendorArray[n]);
				$("#sort_vendor").append("<option value='" + tagsVendorArray[n] + "'>" + tagsVendorArray[n]);
			}
		}
		$("#vendor_options").append(" <button class='sort'>Sort</button>");

		// other options
		$("#search_options").append("<form id='other_options'><label for='sort_sort'>Related Sort: </label><select id='sort_sort'><option value='All'>All Sorts</option>");
		let tagsSortArray = [...tagsSort].sort();
		console.log(tagsSortArray);
		console.log(tagsSortArray.length);
		for (n = 0; n < tagsSortArray.length; n++) {
			if (!tagsSortArray[n]) {} else {
				var tagsSortArrayId = tagsSortArray[n].replace(/\s/g, '').toLowerCase();
				//$("#sort_sort").append("<option value='" + tagsSortArrayId + "'>" + tagsSortArray[n]);
				$("#sort_sort").append("<option value='" + tagsSortArray[n] + "'>" + tagsSortArray[n]);
			}
		}
		$("#other_options").append(" <button class='sort'>Sort</button>");

		// END BUILD SEARCH AND SORT OPTIONS
		$("#alpha_options .sort").on("click", function () {
			k = 0;
			kcore = 0;
			//var content = $("select#sort_content").children("option:selected").val();
			var alpha = $("select#sort_alpha").children("option:selected").val();
			//var sort = $("select#sort_sort").children("option:selected").val();
			//var subject = $("select#sort_subject").children("option:selected").val();
			search_content(alpha);
			//alert(alpha);
			return false;

		});
		$("#content_options .sort").on("click", function () {
			k = 0;
			kcore = 0;
			var content = $("select#sort_content").children("option:selected").val();
			//var alpha = $("select#sort_alpha").children("option:selected").val();
			//var sort = $("select#sort_sort").children("option:selected").val();
			//var subject = $("select#sort_subject").children("option:selected").val();
			search_content(content);
			//alert(content);
			return false;

		});
		$("#subject_options .sort").on("click", function () {
			k = 0;
			kcore = 0;
			//var content = $("select#sort_content").children("option:selected").val();
			//var alpha = $("select#sort_alpha").children("option:selected").val();
			//var sort = $("select#sort_sort").children("option:selected").val();
			var subject = $("select#sort_subject").children("option:selected").val();
			//search_content(subject + "-CORE");
			//alert(subject + "-CORE")
			search_content(subject);
			//alert(subject);
			return false;

		});
		$("#other_options .sort").on("click", function () {
			k = 0;
			kcore = 0;
			//var content = $("select#sort_content").children("option:selected").val();
			//var alpha = $("select#sort_alpha").children("option:selected").val();
			var sort = $("select#sort_sort").children("option:selected").val();
			//var subject = $("select#sort_subject").children("option:selected").val();
			search_content(sort);
			return false;

		});
		$("#vendor_options .sort").on("click", function () {
			k = 0;
			kcore = 0;
			//var content = $("select#sort_content").children("option:selected").val();
			//var alpha = $("select#sort_alpha").children("option:selected").val();
			//var sort = $("select#sort_sort").children("option:selected").val();
			var vendor = $("select#sort_vendor").children("option:selected").val();
			search_content(vendor);
			//alert(alpha);
			return false;

		});

		// Build Key
		$("aside#legend").append("<div id='legend'><h2>Legend: </h2><ul>")
		let tagsContentKeyArray = [...tagsContent].sort(function (a, b) {
			return a.toLowerCase().localeCompare(b.toLowerCase());
		});
		console.log(tagsContentKeyArray);
		console.log(tagsContentKeyArray.length);
		for (ck = 0; ck < tagsContentKeyArray.length; ck++) {
			if (!tagsContentKeyArray[ck]) {} else {
				var tagsContentKeyArrayId = tagsContentKeyArray[ck].replace(/\s/g, '').toLowerCase();
				$("aside #legend ul").append("<li tabindex='0' title='" + tagsContentKeyArray[ck] + "'><span class='show-tags icon-" + tagsContentKeyArrayId + "'></span> = " + tagsContentKeyArray[ck]);
			}
		}
		$("#legend li").on("click keypress", function () {
			k = 0;
            kcore = 0;
			var legendSort = $(this).attr("title");
			search_content(legendSort);
		});
	}); // end JSON
}); // end ready