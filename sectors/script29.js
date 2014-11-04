<!doctype html>
<!--[if lt IE 7 ]>
<html lang="en" class="no-js ie6">
<![endif]-->
<!--[if IE 7 ]>
<html lang="en" class="no-js ie7">
<![endif]-->
<!--[if IE 8 ]>
<html lang="en" class="no-js ie8">
<![endif]-->
<!--[if IE 9 ]>
<html lang="en" class="no-js ie9">
<![endif]-->
<!--[if (gt IE 9)|!(IE)]><!-->
<html lang="en" class="no-js">
<!--<![endif]-->
<head>
	
	<meta charset="utf-8"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>

	<title>Payrolls by sector</title><?php /* EDIT ME */ ?>

	<link rel="shortcut icon" href="http://si.wsj.net/favicon.ico"/>
	<link rel="apple-touch-icon" href="http://s.wsj.net/apple-touch-icon.png"/>

	<meta name="apple-mobile-web-app-capable" content="yes"/>
	<meta name="format-detection" content="telephone=no">

	<?php
		/* - Fill out this meta info - */
	?>
			<!-- Meta: URL -->
			<link rel="canonical" href=""/>
			<meta property="og:url" content=""/>

			<!-- Meta: Images -->
			<link rel="image_src" href=""/>
			<meta property="og:image" content=""/>
			<meta name="twitter:image:src" content="">

			<!-- Meta: Title -->
			<meta name="title" content=""/>
			<meta property="og:title" content=""/>
			<meta name="twitter:title" content="">

			<!-- Meta: Description -->
			<meta name="description" content=""/>
			<meta name="twitter:description" content="">

			<!-- Meta: Keywords -->
			<meta name="keywords" content=""/>
			<meta name="news_keywords" content="">
	<?php
		/* - You're all done with meta info - */
	?>

	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<meta name="author" content="Unknown" />
	<meta name="twitter:domain" content="WSJ.com">
	<meta name="twitter:card" content="photo">
	<meta name="twitter:site" content="@wsj">
	<meta property="og:site_name" content="The Wall Street Journal"/>
	<meta property="og:type" content="article"/>
<!-- skip some of the includes for faster ofline loading
	<script type="text/javascript" src="http://online.wsj.com/public/resources/documents/WSJ_Interactive_TrackingAndAdsv6.min.js"></script>

	<script src="http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.2/modernizr.min.js"></script>

	<link rel="stylesheet" href="http://fonts.wsj.net/HCo_Whitney/font_HCo_Whitney.css" type="text/css"/>
	<link rel="stylesheet" href="http://fonts.wsj.net/HCo_Chronicle/font_HCo_Chronicle.css" type="text/css"/>

	<!--[if lte IE 9]>
	<link rel="stylesheet" href="http://fonts.wsj.net/HCo_Whitney/font_HCo_Whitney-ie.css" type="text/css"/>
	<link rel="stylesheet" href="http://fonts.wsj.net/HCo_Chronicle/font_HCo_Chronicle-ie.css" type="text/css"/>
	<![endif]-->


	<script src="js/libs/d3.v3.min.js"></script>
	<script src="js/libs/jquery.min.js"></script>
	<script src="js/common.js"></script>
	<script src="js/script3.js"></script>


	<!-- Bootstrap -->

	<link href="css/libs/bootstrap.min.css" rel="stylesheet" type="text/css" />
	
	<!-- jQuery UI -->
	<link rel="stylesheet" href="css/libs/jquery-ui.structure.min.css"/>	
	<link rel="stylesheet" href="css/libs/jquery-ui.min.css"/>	
	
	<!-- DataTables -->

	<link rel="stylesheet" href="css/libs/dataTables.bootstrap.css"/>
	
	<!-- Social Climber -->
	<link rel="stylesheet" href="css/libs/jquery.socialclimber.css"/>


	<link rel="stylesheet" href="css/style.css"/>

</head>

<body class="">
	<div class="top-header">
		<a href="http://wsj.com" title="The Wall Street Journal"><img src="img/wsj.png"></a>
	</div>

<!---	<div id="top-ad"><iframe src="http://ad.doubleclick.net/adi/interactive.wsj.com/sports_interactive;!category=;sz=728x90;ord=8921892189218921;" width="728" height="90" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="no"></iframe></div>-->

	<div id="main-wrapper" class="">
		<div id="main-content" class="container">
			<header class="row">
				<div class="social-links col-md-12"></div>
				<div class="col-md-12">

				<h1>Sectors</h1>
								
				<p>The classic month-to-month payrolls number is a strong indicator of the health of the economy, but it doesn't capture the fact that, even in the depths of a recession, some sectors thrive, while others aren't adding jobs even during a sustained recovery.</p>

					<div class="byline">By <a href="#">Andrew</a></div>

					<div class="meta">
						<!--Last updated Sept. 10, 2014 at 2:09 p.m. ET <div class="meta-split">|</div> -->
						Published Sept. 10, 2014 at 2:09 p.m. ET
					</div>
				</div>
			</header>
	
			<div class="row">
			<div class="sectors">
				<h3>Piecemeal Recovery</h3>
					<p>Below, the economy broken down into eighteen large, identifiable sectors, sorted by how each sector has performed in a given month. Click on any month for a snapshot of each sector's performance.</p>
					<h4>Number of sectors <pill class = "positive">gaining</pill> or losing <pill class = "negative"> jobs in<span id="thisMonth"> a given month</span> </h4>

			<div class="row" id="timeButtons">
				<h6>Show change since:</h6>
				<button type='button' class="btn btn" id="y2k">
					y2k (1.1.2000)	
				</button>		
				<button type='button' class="btn btn-primary"  id="recession">
					The recession (1.1.2008)
				</button>		
				<button type='button' class="btn btn" id="recovery">
					The recovery (6.1.2009)			
				</button>		
			
			</div>

			<div class="row" id="sortButtons">
				<h6>Sort the sector boxes by:</h6>
				<button type='button' class="btn btn-primary" id="pctChange">
					Monthly jobs lost/gained (percentage)				</button>		
				<button type='button' class="btn btn"  id="change">
					Monthly jobs lost/gained (total)
				</button>		
				<button type='button' class="btn btn"  id="value">
					Total jobs in sector			
				</button>		
			
			</div>

				
					<div class="chart">
						<svg>
							<g id="viz">
								<g id="onlyBoxes">
									<g id="recessions"></g>						
									<g id="listenerBoxes"></g>							
									<g id="x" class="axis"></g>
									<g id="y" class="axis">
										<g id="unch"></g>									
									</g>
									<g id="boxes"></g>
								</g id = "onlyBoxes">
								<g id="bars">
									<rect id='boxBounder'></rect>
										

									</g id = "barViz">-->
									<g id="rebarViz">
										<g id = "shadedRect"></g>
										<g id = "barBackers"></g>
										<g id = "sectorLabels"></g>										
										<g id = "barChange">		
											<g id = "barBoxes"><text></text></g>
											<g id = "barBoxLabels"></g>
										</g id = "barChange">
										<g id = "barSize">
											<g id="barRectShaders"></g>
											<g id="barRects"><text></text></g>
											<g id="barRectLabels"></g>							
										</g id = "barSize">
										<g id = "barUp">
											<g id="upCircles"><text></text></g>
											<g id="upCircleLabels"></g>							
										</g id = "barUp">
										<g id = "barDown">
											<g id="downCircles"></g>
											<g id="downCircleLabels"></g>							
										</g id = "barDown">

									</g id = "rebarViz">
								</g id = "bars">
							</g id="viz">
						</svg>
					</div>
			</div>

			</section>
	
			</section>

		</div>
	</div>

	<footer>
		<div id="source-line">Copyright &copy;<?php echo date("Y"); ?> Dow Jones & Company, Inc. All Rights Reserved. <a href="http://online.wsj.com/public/page/privacy-policy.html?mod=WSJ_footer">PRIVACY POLICY</a> | <a href="http://online.wsj.com/public/page/subscriber_agreement.html?mod=WSJ_footer">USER AGREEMENT</a></div>
	</footer>
<!--SKIP FOR OFFLINE
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>

	<script type="text/javascript" src="http://graphics.wsj.com/libs/js/wsj/FrameMessenger/0.0.1/framemessenger.js"></script>
  	<script type="text/javascript"
            id="framemessenger_graphics"
            data-frame-name="EDITME"
            data-root-element="#interactive_wrapper"
            src="http://graphics.wsj.com/libs/js/wsj/FrameMessenger/0.0.1/framemessenger_graphics.js"></script>

	<script type="text/javascript">
		var proj_id = "Interactive proj ID";
		var proj_headline = "Interactive proj HEADLINE";

		var trackingOpts = {
			pageName_over:"WSJ_infogrfx_interactive_"+proj_id+"_"+proj_headline
		};

//		window.countPage(proj_id, proj_headline, "", trackingOpts);-->
	</script>


	<script type="text/javascript">
		(function(a,b,c,d){
		a='//tags.tiqcdn.com/utag/wsjdn/newsgraphics/prod/utag.js';
		b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async=true;
		a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a);
		})();
	</script>

</body>
</html>
