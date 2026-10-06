import 'package:flutter/material.dart';
import '../models/match_model.dart';
import '../models/player_model.dart';
import '../services/admob_service.dart';
import '../widgets/ad_banner_widget.dart';

class LiveScoringScreen extends StatefulWidget {
  final Team teamA;
  final Team teamB;
  final int totalOvers;

  const LiveScoringScreen({
    super.key,
    required this.teamA,
    required this.teamB,
    required this.totalOvers,
  });

  @override
  State<LiveScoringScreen> createState() => _LiveScoringScreenState();
}

class _LiveScoringScreenState extends State<LiveScoringScreen> {
  int _totalRuns = 0;
  int _wickets = 0;
  int _completedOvers = 0;
  int _ballsInCurrentOver = 0;
  final List<String> _currentOverDeliveries = [];

  // Striker & Non-striker index
  int _strikerIndex = 0;
  int _nonStrikerIndex = 1;

  void _recordBall(int runs, {bool isWicket = false, bool isWide = false, bool isNoBall = false}) {
    setState(() {
      _totalRuns += runs;

      if (isWicket) {
        _wickets++;
        _currentOverDeliveries.add('W');
      } else if (isWide) {
        _currentOverDeliveries.add('Wd');
      } else if (isNoBall) {
        _currentOverDeliveries.add('Nb');
      } else {
        _currentOverDeliveries.add('$runs');
      }

      // Valid delivery (not a wide/no ball)
      if (!isWide && !isNoBall) {
        _ballsInCurrentOver++;

        // Rotate strike on odd runs
        if (runs % 2 == 1) {
          final temp = _strikerIndex;
          _strikerIndex = _nonStrikerIndex;
          _nonStrikerIndex = temp;
        }

        // Over completed!
        if (_ballsInCurrentOver == 6) {
          _completedOvers++;
          _ballsInCurrentOver = 0;
          _currentOverDeliveries.clear();

          // Strike rotates at the end of the over
          final temp = _strikerIndex;
          _strikerIndex = _nonStrikerIndex;
          _nonStrikerIndex = temp;

          // ==========================================
          // TRIGGER GOOGLE ADMOB INTERSTITIAL AD ON OVER BREAK
          // ==========================================
          AdMobService.showInterstitialAd(
            onComplete: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Over $_completedOvers Completed! Next over starting.'),
                  duration: const Duration(seconds: 2),
                ),
              );
            },
          );
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final runRate = _completedOvers + (_ballsInCurrentOver / 6.0) > 0
        ? (_totalRuns / (_completedOvers + (_ballsInCurrentOver / 6.0))).toStringAsFixed(2)
        : '0.00';

    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.teamA.name} vs ${widget.teamB.name}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.ads_click),
            tooltip: 'Test Over AdMob Interstitial',
            onPressed: () => AdMobService.showInterstitialAd(),
          ),
        ],
      ),
      body: Column(
        children: [
          // Match Summary Score Header
          Container(
            padding: const EdgeInsets.all(20),
            color: const Color(0xFF0F172A),
            child: Column(
              children: [
                Text(
                  '${widget.teamA.name} - 1st Innings',
                  style: const TextStyle(color: Colors.white70, fontSize: 13),
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      '$_totalRuns/$_wickets',
                      style: const TextStyle(
                        fontSize: 44,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(width: 12),
                    Text(
                      '($_completedOvers.$_ballsInCurrentOver / ${widget.totalOvers} ov)',
                      style: const TextStyle(fontSize: 18, color: Colors.cyanAccent),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Current Run Rate: $runRate',
                  style: const TextStyle(color: Colors.white60, fontSize: 12),
                ),
              ],
            ),
          ),

          // Current Over Ball-by-Ball Circles
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 16.0),
            child: Row(
              children: [
                const Text('This Over: ', style: TextStyle(fontWeight: FontWeight.bold)),
                const SizedBox(width: 8),
                Expanded(
                  child: Row(
                    children: _currentOverDeliveries.map((b) {
                      final isW = b == 'W';
                      final isBoundary = b == '4' || b == '6';
                      return Container(
                        margin: const EdgeInsets.symmetric(horizontal: 3),
                        width: 28,
                        height: 28,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: isW
                              ? Colors.redAccent
                              : (isBoundary ? Colors.amber : Colors.blueGrey),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          b,
                          style: const TextStyle(
                            color: Colors.black,
                            fontWeight: FontWeight.bold,
                            fontSize: 11,
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),

          const Divider(height: 1),

          // Quick Scoring Keypad
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: GridView.count(
                crossAxisCount: 4,
                mainAxisSpacing: 10,
                crossAxisSpacing: 10,
                children: [
                  _scoringButton('0', () => _recordBall(0)),
                  _scoringButton('1', () => _recordBall(1)),
                  _scoringButton('2', () => _recordBall(2)),
                  _scoringButton('3', () => _recordBall(3)),
                  _scoringButton('4', () => _recordBall(4), color: Colors.blueAccent),
                  _scoringButton('6', () => _recordBall(6), color: Colors.purpleAccent),
                  _scoringButton('Wicket', () => _recordBall(0, isWicket: true), color: Colors.redAccent),
                  _scoringButton('Wide +1', () => _recordBall(1, isWide: true), color: Colors.amber),
                  _scoringButton('No Ball +1', () => _recordBall(1, isNoBall: true), color: Colors.orange),
                  _scoringButton('5', () => _recordBall(5)),
                  _scoringButton('Over End', () {
                    AdMobService.showInterstitialAd();
                  }, color: Colors.teal),
                  _scoringButton('Reward', () {
                    AdMobService.showRewardedAd(
                      onUserEarnedReward: (r) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Claimed +100 Cricket Pro Coins!')),
                        );
                      },
                    );
                  }, color: Colors.green),
                ],
              ),
            ),
          ),

          // ==========================================
          // GOOGLE ADMOB BANNER AT BOTTOM OF SCREEN
          // ==========================================
          const AdBannerWidget(),
        ],
      ),
    );
  }

  Widget _scoringButton(String label, VoidCallback onTap, {Color? color}) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: color ?? const Color(0xFF1E293B),
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        padding: EdgeInsets.zero,
      ),
      onPressed: onTap,
      child: Text(
        label,
        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
        textAlign: TextAlign.center,
      ),
    );
  }
}
