import React from 'react';
import { Play, RotateCcw, Clock, Shield, Calendar, MapPin, ChevronRight, Trophy, Users, BarChart3, Sparkles } from 'lucide-react';
import { CricketMatch, Team } from '../types/cricket';

interface Props {
  matches: CricketMatch[];
  activeMatch: CricketMatch | null;
  onNewMatch: () => void;
  onResumeMatch: (match: CricketMatch) => void;
  onSelectMatch: (match: CricketMatch) => void;
  onOpenPlayerStats: () => void;
  onOpenTeamManagement: () => void;
}

export const Phase1Home: React.FC<Props> = ({
  matches,
  activeMatch,
  onNewMatch,
  onResumeMatch,
  onSelectMatch,
  onOpenPlayerStats,
  onOpenTeamManagement
}) => {
  const completedMatches = matches.filter((m) => m.status === 'completed');
  const liveMatches = matches.filter((m) => m.status === 'live' || m.status === 'innings_break');

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/40 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 text-xs font-bold border border-blue-500/30">
              PHASE 1: HOME & MATCH SETUP
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              Live Ready
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Cricket Scoreboard Pro
          </h1>
          <p className="text-blue-200 text-sm sm:text-base mt-2 font-medium">
            Complete Data • Smart Features • Professional Experience
          </p>
          <p className="text-slate-400 text-xs mt-1">
            Material 3 Dark Blue Theme • 15 Phases Live Scoring Engine • AdMob Ads • Hive DB
          </p>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={onNewMatch}
              className="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start New Match</span>
            </button>

            <button
              onClick={onOpenTeamManagement}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-600/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            >
              <Shield className="w-4 h-4" />
              <span>+ Add Custom Team</span>
            </button>

            {activeMatch && (
              <button
                onClick={() => onResumeMatch(activeMatch)}
                className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Resume Live ({activeMatch.teamA.shortName} vs {activeMatch.teamB.shortName})</span>
              </button>
            )}

            <button
              onClick={onOpenPlayerStats}
              className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-colors border border-slate-700"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Player Stats</span>
            </button>

            <button
              onClick={onOpenTeamManagement}
              className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-colors border border-slate-700"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Teams & Rosters</span>
            </button>
          </div>
        </div>

        {/* Decorative background ball & pitch glow */}
        <div className="absolute right-[-40px] top-[-40px] w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Live / In-Progress Matches Section */}
      {liveMatches.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>Live Matches ({liveMatches.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveMatches.map((m) => (
              <div
                key={m.id}
                onClick={() => onResumeMatch(m)}
                className="bg-slate-900 border border-blue-800/60 hover:border-blue-500 rounded-2xl p-5 cursor-pointer shadow-lg transition-all group"
              >
                <div className="flex justify-between items-center text-xs text-slate-400 mb-3">
                  <span className="font-mono bg-blue-900/40 text-blue-300 px-2 py-0.5 rounded">
                    {m.settings.format} • {m.settings.venue}
                  </span>
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> LIVE
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-base flex items-center gap-2">
                      <span className="text-xl">{m.teamA.logo}</span>
                      {m.teamA.name}
                    </span>
                    <span className="font-mono font-bold text-white text-lg">
                      {m.innings1.totalRuns}/{m.innings1.totalWickets}{' '}
                      <span className="text-xs text-slate-400">({m.innings1.oversDisplay})</span>
                    </span>
                  </div>

                  {m.innings2 && (
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white text-base flex items-center gap-2">
                        <span className="text-xl">{m.teamB.logo}</span>
                        {m.teamB.name}
                      </span>
                      <span className="font-mono font-bold text-white text-lg">
                        {m.innings2.totalRuns}/{m.innings2.totalWickets}{' '}
                        <span className="text-xs text-slate-400">({m.innings2.oversDisplay})</span>
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-blue-400 font-semibold group-hover:text-cyan-300">
                  <span>Click to resume live scoring &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Matches Preview (No India or Australia) */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <span>Upcoming Fixtures</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
              <span className="bg-slate-800 px-2 py-0.5 rounded font-mono text-cyan-300">T20 Super League</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Tomorrow, 19:00</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🐎</span>
                <span className="font-bold text-white">Stallions CC</span>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase">VS</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Gladiators</span>
                <span className="text-2xl">⚔️</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
              <MapPin className="w-3.5 h-3.5" /> Gaddafi Stadium, Lahore
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md">
            <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
              <span className="bg-slate-800 px-2 py-0.5 rounded font-mono text-cyan-300">Club Championship</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Oct 10, 15:30</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="font-bold text-white">Thunderbolts XI</span>
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase">VS</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">Stallions CC</span>
                <span className="text-2xl">🐎</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
              <MapPin className="w-3.5 h-3.5" /> Rawalpindi Cricket Ground
            </p>
          </div>
        </div>
      </div>

      {/* Match History Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Match History ({completedMatches.length})</span>
          </h2>
        </div>

        <div className="space-y-3">
          {completedMatches.map((m) => (
            <div
              key={m.id}
              onClick={() => onSelectMatch(m)}
              className="bg-slate-900 border border-slate-800 hover:border-blue-600/60 rounded-2xl p-4 sm:p-5 cursor-pointer shadow-md transition-all hover:bg-slate-900/90 group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-mono">
                    {m.settings.format}
                  </span>
                  <span>•</span>
                  <span>{m.settings.venue}</span>
                  <span>•</span>
                  <span>{m.settings.matchDate}</span>
                </div>
                {m.result && (
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                    {m.result.resultText}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span className="text-lg">{m.teamA.logo}</span>
                    {m.teamA.name}
                  </span>
                  <span className="font-mono font-bold text-cyan-400 text-base">
                    {m.innings1.totalRuns}/{m.innings1.totalWickets}{' '}
                    <span className="text-xs text-slate-400">({m.innings1.oversDisplay} ov)</span>
                  </span>
                </div>

                {m.innings2 && (
                  <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="text-lg">{m.teamB.logo}</span>
                      {m.teamB.name}
                    </span>
                    <span className="font-mono font-bold text-cyan-400 text-base">
                      {m.innings2.totalRuns}/{m.innings2.totalWickets}{' '}
                      <span className="text-xs text-slate-400">({m.innings2.oversDisplay} ov)</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                <span>
                  {m.result?.playerOfTheMatch && (
                    <span className="text-slate-300">
                      🏆 Player of Match: <strong className="text-white">{m.result.playerOfTheMatch.playerName}</strong> ({m.result.playerOfTheMatch.performance})
                    </span>
                  )}
                </span>
                <span className="text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                  View Full Scorecard & Analytics <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
