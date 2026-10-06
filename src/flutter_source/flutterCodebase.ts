export interface FlutterFile {
  path: string;
  name: string;
  category: 'config' | 'main' | 'models' | 'services' | 'screens' | 'widgets';
  content: string;
}

export const FLUTTER_CODEBASE: FlutterFile[] = [
  {
    path: '.github/workflows/build_apk.yml',
    name: 'build_apk.yml',
    category: 'config',
    content: `name: Build Cricket Scoreboard APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build-apk:
    name: Build Android Release APK
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
          cache: 'gradle'
      - uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.22.x'
          channel: 'stable'
          cache: true
      - run: flutter pub get
      - run: flutter build apk --release --no-tree-shake-icons
      - uses: actions/upload-artifact@v4
        with:
          name: CricketScoreboard-Release-APK
          path: build/app/outputs/flutter-apk/app-release.apk
          retention-days: 14`
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'config',
    content: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.cricket.scoreboard.cricket_scoreboard_15phases">

    <!-- Permissions required by Google AdMob -->
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.WAKE_LOCK"/>

    <application
        android:label="Cricket Scoreboard"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher"
        android:hardwareAccelerated="true">

        <!-- Google AdMob Application ID (Official Test ID) -->
        <!-- Replace 'ca-app-pub-3940256099942544~3347511713' with your live ID in production -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3940256099942544~3347511713"/>

        <meta-data
            android:name="com.google.android.gms.ads.flag.OPTIMIZE_INITIALIZATION"
            android:value="true"/>
        <meta-data
            android:name="com.google.android.gms.ads.flag.OPTIMIZE_AD_LOADING"
            android:value="true"/>

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>

        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>`
  },
  {
    path: 'ios/Runner/Info.plist',
    name: 'Info.plist',
    category: 'config',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleName</key>
	<string>Cricket Scoreboard</string>
	<key>CFBundleIdentifier</key>
	<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>

	<!-- Google AdMob Application ID for iOS -->
	<key>GADApplicationIdentifier</key>
	<string>ca-app-pub-3940256099942544~1458002511</string>

	<!-- Google AdMob SKAdNetwork Attribution IDs -->
	<key>SKAdNetworkItems</key>
	<array>
		<dict>
			<key>SKAdNetworkIdentifier</key>
			<string>cstr6suwn9.skadnetwork</string>
		</dict>
		<dict>
			<key>SKAdNetworkIdentifier</key>
			<string>4fzdc2evr5.skadnetwork</string>
		</dict>
	</array>
</dict>
</plist>`
  },
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    category: 'config',
    content: `name: cricket_scoreboard_15phases
description: "Cricket Scoreboard App - 15 Phases: Complete Data, Smart Features, Professional Experience"
publish_to: "none"
version: 1.0.0+1

environment:
  sdk: ">=3.0.0 <4.0.0"

dependencies:
  flutter:
    sdk: flutter
  flutter_riverpod: ^2.5.1
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  fl_chart: ^0.68.0
  pdf: ^3.10.8
  printing: ^5.12.0
  share_plus: ^9.0.0
  google_mobile_ads: ^5.1.0
  intl: ^0.19.0
  google_fonts: ^6.2.1
  uuid: ^4.4.0
  confetti: ^0.7.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  hive_generator: ^2.0.1
  build_runner: ^2.4.9

flutter:
  uses-material-design: true
`
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    category: 'main',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'services/admob_service.dart';
import 'screens/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Hive storage
  await Hive.initFlutter();
  
  // Initialize Google Mobile Ads (AdMob)
  await MobileAds.instance.initialize();
  AdMobService.initialize();

  runApp(const ProviderScope(child: CricketScoreboardApp()));
}

class CricketScoreboardApp extends StatelessWidget {
  const CricketScoreboardApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Cricket Scoreboard App - 15 Phases',
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0B192C),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFF008DDA),
          secondary: Color(0xFF41B06E),
          surface: Color(0xFF1E3E62),
          onSurface: Colors.white,
          error: Color(0xFFFF4D4D),
        ),
        textTheme: GoogleFonts.outfitTextTheme(ThemeData.dark().textTheme),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0B192C),
          elevation: 0,
          centerTitle: true,
        ),
      ),
      home: const HomeScreen(),
    );
  }
}`
  },
  {
    path: 'lib/services/admob_service.dart',
    name: 'admob_service.dart',
    category: 'services',
    content: `import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

class AdMobService {
  // Official Test Ad Unit IDs provided by Google AdMob
  static const String _testBannerAndroid = 'ca-app-pub-3940256099942544/6300978111';
  static const String _testBannerIOS = 'ca-app-pub-3940256099942544/2934735716';

  static const String _testInterstitialAndroid = 'ca-app-pub-3940256099942544/1033173712';
  static const String _testInterstitialIOS = 'ca-app-pub-3940256099942544/4411468910';

  static const String _testRewardedAndroid = 'ca-app-pub-3940256099942544/5224354917';
  static const String _testRewardedIOS = 'ca-app-pub-3940256099942544/1712485313';

  static String get bannerAdUnitId {
    if (kIsWeb || Platform.isAndroid) return _testBannerAndroid;
    if (Platform.isIOS) return _testBannerIOS;
    return _testBannerAndroid;
  }

  static String get interstitialAdUnitId {
    if (kIsWeb || Platform.isAndroid) return _testInterstitialAndroid;
    if (Platform.isIOS) return _testInterstitialIOS;
    return _testInterstitialAndroid;
  }

  static String get rewardedAdUnitId {
    if (kIsWeb || Platform.isAndroid) return _testRewardedAndroid;
    if (Platform.isIOS) return _testRewardedIOS;
    return _testRewardedAndroid;
  }

  static InterstitialAd? _interstitialAd;
  static bool isInterstitialLoaded = false;

  static RewardedAd? _rewardedAd;
  static bool isRewardedLoaded = false;

  static void initialize() {
    loadInterstitialAd();
    loadRewardedAd();
  }

  static BannerAd createBannerAd({required Function() onAdLoaded, Function(LoadAdError)? onAdFailed}) {
    return BannerAd(
      adUnitId: bannerAdUnitId,
      size: AdSize.banner,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (ad) => onAdLoaded(),
        onAdFailedToLoad: (ad, error) {
          ad.dispose();
          if (onAdFailed != null) onAdFailed(error);
        },
      ),
    );
  }

  static void loadInterstitialAd() {
    InterstitialAd.load(
      adUnitId: interstitialAdUnitId,
      request: const AdRequest(),
      adLoadCallback: InterstitialAdLoadCallback(
        onAdLoaded: (ad) {
          _interstitialAd = ad;
          isInterstitialLoaded = true;
          _interstitialAd!.fullScreenContentCallback = FullScreenContentCallback(
            onAdDismissedFullScreenContent: (ad) {
              ad.dispose();
              isInterstitialLoaded = false;
              loadInterstitialAd();
            },
            onAdFailedToShowFullScreenContent: (ad, error) {
              ad.dispose();
              isInterstitialLoaded = false;
              loadInterstitialAd();
            },
          );
        },
        onAdFailedToLoad: (error) {
          isInterstitialLoaded = false;
          _interstitialAd = null;
        },
      ),
    );
  }

  static void showInterstitialAd({Function()? onComplete}) {
    if (isInterstitialLoaded && _interstitialAd != null) {
      _interstitialAd!.show();
      if (onComplete != null) onComplete();
    } else {
      loadInterstitialAd();
      if (onComplete != null) onComplete();
    }
  }

  static void loadRewardedAd() {
    RewardedAd.load(
      adUnitId: rewardedAdUnitId,
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: (ad) {
          _rewardedAd = ad;
          isRewardedLoaded = true;
        },
        onAdFailedToLoad: (error) {
          isRewardedLoaded = false;
          _rewardedAd = null;
        },
      ),
    );
  }

  static void showRewardedAd({required Function(RewardItem reward) onUserEarnedReward}) {
    if (isRewardedLoaded && _rewardedAd != null) {
      _rewardedAd!.show(onUserEarnedReward: (ad, reward) => onUserEarnedReward(reward));
    } else {
      loadRewardedAd();
    }
  }
}`
  },
  {
    path: 'lib/widgets/ad_banner_widget.dart',
    name: 'ad_banner_widget.dart',
    category: 'widgets',
    content: `import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import '../services/admob_service.dart';

class AdBannerWidget extends StatefulWidget {
  final EdgeInsetsGeometry padding;
  const AdBannerWidget({super.key, this.padding = const EdgeInsets.symmetric(vertical: 4.0)});

  @override
  State<AdBannerWidget> createState() => _AdBannerWidgetState();
}

class _AdBannerWidgetState extends State<AdBannerWidget> {
  BannerAd? _bannerAd;
  bool _isBannerLoaded = false;

  @override
  void initState() {
    super.initState();
    _bannerAd = AdMobService.createBannerAd(
      onAdLoaded: () {
        if (mounted) setState(() => _isBannerLoaded = true);
      },
    );
    _bannerAd?.load();
  }

  @override
  void dispose() {
    _bannerAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (!_isBannerLoaded || _bannerAd == null) {
      return Container(
        height: 50,
        margin: widget.padding,
        color: const Color(0xFF0F172A),
        alignment: Alignment.center,
        child: const Text('Google AdMob Banner Space (320x50)', style: TextStyle(color: Colors.white38, fontSize: 11)),
      );
    }
    return Container(
      alignment: Alignment.center,
      width: _bannerAd!.size.width.toDouble(),
      height: _bannerAd!.size.height.toDouble(),
      margin: widget.padding,
      child: AdWidget(ad: _bannerAd!),
    );
  }
}`
  },
  {
    path: 'lib/screens/live_scoring_screen.dart',
    name: 'live_scoring_screen.dart',
    category: 'screens',
    content: `import 'package:flutter/material.dart';
import '../models/match_model.dart';
import '../services/admob_service.dart';
import '../widgets/ad_banner_widget.dart';

class LiveScoringScreen extends StatefulWidget {
  final Team teamA;
  final Team teamB;
  final int totalOvers;

  const LiveScoringScreen({super.key, required this.teamA, required this.teamB, required this.totalOvers});

  @override
  State<LiveScoringScreen> createState() => _LiveScoringScreenState();
}

class _LiveScoringScreenState extends State<LiveScoringScreen> {
  int _totalRuns = 0;
  int _wickets = 0;
  int _completedOvers = 0;
  int _ballsInCurrentOver = 0;

  void _recordBall(int runs, {bool isWicket = false, bool isWide = false}) {
    setState(() {
      _totalRuns += runs;
      if (isWicket) _wickets++;
      if (!isWide) {
        _ballsInCurrentOver++;
        if (_ballsInCurrentOver == 6) {
          _completedOvers++;
          _ballsInCurrentOver = 0;
          // Trigger AdMob Interstitial on Over Break!
          AdMobService.showInterstitialAd();
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('\${widget.teamA.name} vs \${widget.teamB.name}')),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            color: const Color(0xFF0F172A),
            child: Column(
              children: [
                Text('Score: \$_totalRuns/\$_wickets', style: const TextStyle(fontSize: 36, fontWeight: FontWeight.bold, color: Colors.white)),
                Text('Overs: \$_completedOvers.\$_ballsInCurrentOver / \${widget.totalOvers}', style: const TextStyle(color: Colors.cyanAccent)),
              ],
            ),
          ),
          Expanded(
            child: Center(
              child: Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  ElevatedButton(onPressed: () => _recordBall(0), child: const Text('0')),
                  ElevatedButton(onPressed: () => _recordBall(1), child: const Text('1')),
                  ElevatedButton(onPressed: () => _recordBall(4), child: const Text('4')),
                  ElevatedButton(onPressed: () => _recordBall(6), child: const Text('6')),
                  ElevatedButton(onPressed: () => _recordBall(0, isWicket: true), child: const Text('Wicket')),
                  ElevatedButton(onPressed: () => AdMobService.showInterstitialAd(), child: const Text('Test Interstitial')),
                ],
              ),
            ),
          ),
          const AdBannerWidget(),
        ],
      ),
    );
  }
}`
  },
  {
    path: 'lib/screens/home_screen.dart',
    name: 'home_screen.dart',
    category: 'screens',
    content: `import 'package:flutter/material.dart';
import '../services/admob_service.dart';
import '../widgets/ad_banner_widget.dart';
import 'match_setup_screen.dart';
import 'live_scoring_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cricket Scoreboard App'),
        actions: [
          IconButton(
            icon: const Icon(Icons.ads_click),
            onPressed: () => AdMobService.showInterstitialAd(),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: Center(
              child: ElevatedButton.icon(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => MatchSetupScreen(
                        onStartMatch: (format, totalOvers, teamA, teamB) {
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (context) => LiveScoringScreen(teamA: teamA, teamB: teamB, totalOvers: totalOvers),
                            ),
                          );
                        },
                      ),
                    ),
                  );
                },
                icon: const Icon(Icons.sports_cricket),
                label: const Text('New Match (1-20 Overs, Lonely Players)'),
              ),
            ),
          ),
          const AdBannerWidget(),
        ],
      ),
    );
  }
}`
  },
  {
    path: 'lib/screens/match_setup_screen.dart',
    name: 'match_setup_screen.dart',
    category: 'screens',
    content: `import 'package:flutter/material.dart';
import '../models/match_model.dart';
import '../models/player_model.dart';

class MatchSetupScreen extends StatefulWidget {
  final Function(MatchFormat format, int totalOvers, Team teamA, Team teamB) onStartMatch;
  const MatchSetupScreen({super.key, required this.onStartMatch});

  @override
  State<MatchSetupScreen> createState() => _MatchSetupScreenState();
}

class _MatchSetupScreenState extends State<MatchSetupScreen> {
  MatchFormat _selectedFormat = MatchFormat.t20;
  int _totalOvers = 20;

  final TextEditingController _teamAController = TextEditingController(text: 'Thunderbolts XI');
  final TextEditingController _teamBController = TextEditingController(text: 'Falcons United');

  final TextEditingController _playerAInput = TextEditingController();
  final List<Player> _teamAPlayers = [];

  final TextEditingController _playerBInput = TextEditingController();
  final List<Player> _teamBPlayers = [];

  void _addPlayerA() {
    if (_playerAInput.text.trim().isEmpty) return;
    setState(() {
      _teamAPlayers.add(Player(
        id: 'p-a-\${_teamAPlayers.length + 1}',
        name: _playerAInput.text.trim(),
        role: PlayerRole.batsman,
      ));
      _playerAInput.clear();
    });
  }

  void _addPlayerB() {
    if (_playerBInput.text.trim().isEmpty) return;
    setState(() {
      _teamBPlayers.add(Player(
        id: 'p-b-\${_teamBPlayers.length + 1}',
        name: _playerBInput.text.trim(),
        role: PlayerRole.batsman,
      ));
      _playerBInput.clear();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Match Setup: 1-20 Overs & Lonely Players')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Choice of Overs (1 to 20):', style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 6,
              children: List.generate(20, (i) => ChoiceChip(
                label: Text('\${i + 1}'),
                selected: _totalOvers == i + 1,
                onSelected: (_) => setState(() => _totalOvers = i + 1),
              )),
            ),
            const SizedBox(height: 20),
            TextField(controller: _teamAController, decoration: const InputDecoration(labelText: 'Custom Team A Name')),
            Row(
              children: [
                Expanded(child: TextField(controller: _playerAInput, decoration: InputDecoration(labelText: 'Add Player #\${_teamAPlayers.length + 1} Lonely'))),
                IconButton(icon: const Icon(Icons.add), onPressed: _addPlayerA),
              ],
            ),
            const SizedBox(height: 20),
            TextField(controller: _teamBController, decoration: const InputDecoration(labelText: 'Custom Team B Name')),
            Row(
              children: [
                Expanded(child: TextField(controller: _playerBInput, decoration: InputDecoration(labelText: 'Add Player #\${_teamBPlayers.length + 1} Lonely'))),
                IconButton(icon: const Icon(Icons.add), onPressed: _addPlayerB),
              ],
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {
                final teamA = Team(id: 'team-a', name: _teamAController.text.trim(), shortName: 'TA', players: _teamAPlayers, playingXIIds: _teamAPlayers.map((p) => p.id).toList());
                final teamB = Team(id: 'team-b', name: _teamBController.text.trim(), shortName: 'TB', players: _teamBPlayers, playingXIIds: _teamBPlayers.map((p) => p.id).toList());
                widget.onStartMatch(_selectedFormat, _totalOvers, teamA, teamB);
              },
              child: Text('Start Match (\$_totalOvers Overs)'),
            ),
          ],
        ),
      ),
    );
  }
}`
  },
  {
    path: 'lib/models/match_model.dart',
    name: 'match_model.dart',
    category: 'models',
    content: `import 'player_model.dart';

enum MatchFormat { t20, odi, test, custom }
enum DismissalType { bowled, caught, lbw, runOut, stumped, hitWicket, retiredHurt }

class Team {
  final String id;
  final String name;
  final String shortName;
  final String logo;
  final List<Player> players;
  final List<String> playingXIIds;

  Team({
    required this.id,
    required this.name,
    required this.shortName,
    this.logo = '🏏',
    required this.players,
    required this.playingXIIds,
  });
}`
  },
  {
    path: 'lib/models/player_model.dart',
    name: 'player_model.dart',
    category: 'models',
    content: `enum PlayerRole { batsman, bowler, allRounder, wicketKeeper }

class Player {
  final String id;
  final String name;
  final PlayerRole role;
  final bool isCaptain;
  final bool isViceCaptain;
  final bool isWicketKeeper;

  Player({
    required this.id,
    required this.name,
    required this.role,
    this.isCaptain = false,
    this.isViceCaptain = false,
    this.isWicketKeeper = false,
  });
}`
  }
];
