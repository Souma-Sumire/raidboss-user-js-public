const headMarkerData = {
  // Offsets: 00:41, 04:12, 08:13
  // Vfx Path: com_share4a1
  '0131': '0131',
  // Offsets: 00:15, 03:35, 08:53
  // Vfx Path: tank_lockonae_0m_5s_01t
  'tankbuster': '01D4',
  // Offsets: 03:08, 03:10, 03:12, 03:14
  // Vfx Path: lockon5_line_1p
  '028C': '028C',
};
const center = {
  x: 100,
  y: 100,
};
Options.Triggers.push({
  id: 'AacHeavyweightM1Savage',
  zoneId: ZoneId.AacHeavyweightM1Savage,
  zoneLabel: { en: 'M9S Souma特供版' },
  overrideTimelineFile: true,
  timeline: `### AAC HEAVYWEIGHT (M1) (SAVAGE)
# ZoneId: 1321
# -ii BBA7 B7C8 B333 B35A B34A B376 B38F B390 B397 B3A2 B35D B38D B709 B705 B706 B36B B36C B38C B33E B340 B341 B3A3 B344 B3A4 B3A6 B399 B39A B39B B398 B393
# -it "Vamp Fatale" "Coffinmaker" "Fatal Flail" "Deadly Doornail" "Charnel Cell"
hideall "--Reset--"
hideall "--sync--"
0.0 "--Reset--" ActorControl { command: "4000000F" } window 0,100000 jump 0
0.0 "--sync--" InCombat { inGameCombat: "1" } window 0,1
5.4 "--sync--" StartsUsing { id: "B384", source: "Vamp Fatale" } window 10,10
10.4 "Killer Voice" Ability { id: "B384", source: "Vamp Fatale" }
20.5 "Hardcore" Ability { id: "B37F", source: "Vamp Fatale" }
30.6 "Vamp Stomp" Ability { id: "B374", source: "Vamp Fatale" }
30.7 "--sync--" Ability { id: "B34C", source: "Vamp Fatale" }
34.7 "Blast Beat" Ability { id: "B375", source: "Vampette Fatale" }
38.1 "Blast Beat" Ability { id: "B375", source: "Vampette Fatale" }
41.7 "Blast Beat" Ability { id: "B375", source: "Vampette Fatale" }
46.7 "Brutal Rain x3+" #Ability { id: "B383", source: "Vamp Fatale" } duration 2
51.7 "--middle--" Ability { id: "B332", source: "Vamp Fatale" }
60.7 "Sadistic Screech" Ability { id: "B366", source: "Vamp Fatale" }
# Coffinmaker
# NOTE: Coffinfiller and Dead Wake only occurs if Coffinmaker is alive
# TODO: Branches for Half Moons based on ignored abilities
67.5 "--untargetable--"
67.5 "--sync--" Ability { id: "B332", source: "Vamp Fatale" }
67.7 "--coffinmaker--"
67.9 "Dead Wake" Ability { id: "B367", source: "Coffinmaker" }
74.3 "--sync--" Ability { id: ["B34E", "B34F", "B350", "B351"], source: "Vamp Fatale" } # Determined by Satiated Stacks
75.1 "Coffinfiller" #Ability { id: "B368", source: "Coffinmaker" }
75.1 "Half Moon" Ability { id: ["B377", "B379", "B37B", "B37D"], source: "Vamp Fatale" }
75.1 "Coffinfiller" #Ability { id: "B368", source: "Coffinmaker" }
78.1 "Half Moon" Ability { id: ["B378", "B37A", "B37C", "B37E"], source: "Vamp Fatale" }
78.1 "Coffinfiller" #Ability { id: "B368", source: "Coffinmaker" }
84.9 "--sync--" Ability { id: "B332", source: "Vamp Fatale" }
85.3 "Dead Wake" Ability { id: "B367", source: "Coffinmaker" }
91.7 "--sync--" Ability { id: ["B34E", "B34F", "B350", "B351"], source: "Vamp Fatale" } # Determined by Satiated Stacks
92.5 "Coffinfiller" #Ability { id: "B369", source: "Coffinmaker" }
92.5 "Half Moon" Ability { id: ["B377", "B379", "B37B", "B37D"], source: "Vamp Fatale" }
92.5 "Coffinfiller" #Ability { id: "B369", source: "Coffinmaker" }
95.5 "Half Moon" Ability { id: ["B378", "B37A", "B37C", "B37E"], source: "Vamp Fatale" }
95.5 "Coffinfiller" #Ability { id: "B369", source: "Coffinmaker" }
102.2 "--sync--" Ability { id: "B332", source: "Vamp Fatale" }
102.6 "Dead Wake" Ability { id: "B367", source: "Coffinmaker" }
109.0 "--sync--" Ability { id: ["B34E", "B34F", "B350", "B351"], source: "Vamp Fatale" } # Determined by Satiated Stacks
109.8 "Coffinfiller" #Ability { id: "B36A", source: "Coffinmaker" }
109.8 "Half Moon" Ability { id: ["B377", "B379", "B37B", "B37D"], source: "Vamp Fatale" }
109.8 "Coffinfiller" #Ability { id: "B36A", source: "Coffinmaker" }
112.8 "Half Moon" Ability { id: ["B378", "B37A", "B37C", "B37E"], source: "Vamp Fatale" }
112.8 "Coffinfiller" #Ability { id: "B36A", source: "Coffinmaker" }
119.0 "--sync--" Ability { id: ["B34E", "B34F", "B350", "B351"], source: "Vamp Fatale" } # Determined by Satiated Stacks
119.9 "Coffinfiller" #Ability { id: "B36A", source: "Coffinmaker" }
119.9 "Half Moon" Ability { id: ["B377", "B379", "B37B", "B37D"], source: "Vamp Fatale" }
119.9 "Coffinfiller" #Ability { id: "B36A", source: "Coffinmaker" }
120.1 "--targetable--"
122.9 "Half Moon" Ability { id: ["B378", "B37A", "B37C", "B37E"], source: "Vamp Fatale" }
122.9 "Coffinfiller" #Ability { id: "B36A", source: "Coffinmaker" }
125.0 "--sync--" StartsUsing { id: "B367", source: "Coffinmaker" }
130.0 "Dead Wake (Enrage)" Ability { id: "B367", source: "Coffinmaker" }
137.9 "Sadistic Screech" Ability { id: "B366", source: ["Coffinmaker", "Vamp Fatale"] } # Possible bug in log
# Back to default arena
143.2 "--middle--" Ability { id: "B332", source: "Vamp Fatale" }
152.3 "Crowd Kill" Ability { id: "B36D", source: "Vamp Fatale" }
162.0 "--middle--" Ability { id: "B332", source: "Vamp Fatale" }
171.3 "Finale Fatale" Ability { id: ["B36F", "B370"], source: "Vamp Fatale" } # Determined by Satiated Stacks
# Circular arena
176.2 "Pulping Pulse" Ability { id: "B373", source: "Vamp Fatale" }
190.3 "Aetherletting Proteans x4" #Ability { id: "B391", source: "Vamp Fatale" } duration 6.3
192.3 "Aetherletting 1" #Ability { id: "B392", source: "Vamp Fatale" } duration 14.4
194.3 "Aetherletting 2" #Ability { id: "B392", source: "Vamp Fatale" } duration 14.4
196.3 "Aetherletting 3" #Ability { id: "B392", source: "Vamp Fatale" } duration 14.4
198.3 "Aetherletting 4" #Ability { id: "B392", source: "Vamp Fatale" } duration 14.4
219.7 "Hardcore" Ability { id: ["B37F", "B380"], source: "Vamp Fatale" } # Determined by Satiated Stacks
224.7 "Pulping Pulse" Ability { id: "B373", source: "Vamp Fatale" }
229.8 "Vamp Stomp" Ability { id: "B374", source: "Vamp Fatale" }
229.9 "--sync--" Ability { id: "B34C", source: "Vamp Fatale" }
233.9 "Blast Beat" Ability { id: "B375", source: "Vampette Fatale" }
237.3 "Blast Beat" Ability { id: "B375", source: "Vampette Fatale" }
240.9 "Blast Beat" Ability { id: "B375", source: "Vampette Fatale" }
245.2 "--sync--" Ability { id: ["B34E", "B34F", "B350", "B351"], source: "Vamp Fatale" } # Determined by Satiated Stacks
245.9 "Half Moon" Ability { id: ["B377", "B379", "B37B", "B37D"], source: "Vamp Fatale" }
248.9 "Half Moon" Ability { id: ["B378", "B37A", "B37C", "B37E"], source: "Vamp Fatale" }
256.1 "Brutal Rain x4+" #Ability { id: "B383", source: "Vamp Fatale" } duration 3
270.1 "Insatiable Thirst" Ability { id: "B372", source: "Vamp Fatale" }
# Back to normal
274.1 "--middle--" Ability { id: "B332", source: "Vamp Fatale" }
283.1 "Sadistic Screech" Ability { id: "B366", source: "Vamp Fatale" }
# Doornail/Flail/Chakram/Buzzsaw phase
295.3 "Plummet" Ability { id: "B38B", source: "Fatal Flail" }
295.4 "--flail x2--"
296.3 "--nail--"
304.3 "Killer Voice" Ability { id: "B384", source: "Vamp Fatale" }
313.4 "Plummet" Ability { id: "B38B", source: "Fatal Flail" }
313.5 "--flail x2--"
314.4 "--nail--"
322.4 "Killer Voice" Ability { id: "B384", source: "Vamp Fatale" }
331.5 "Plummet" Ability { id: "B38B", source: "Fatal Flail" }
331.6 "--flail x2--"
332.5 "--nail--"
355.5 "Sadistic Screech" Ability { id: "B366", source: ["Coffinmaker", "Vamp Fatale"] } # Possible bug in log
# Back to default arena
360.8 "--sync--" Ability { id: "B332", source: "Vamp Fatale" }
369.9 "Crowd Kill" Ability { id: "B36D", source: "Vamp Fatale" }
379.6 "--sync--" Ability { id: "B332", source: "Vamp Fatale" }
388.9 "Finale Fatale" Ability { id: "B370", source: "Vamp Fatale" }
# Circular arena
393.8 "Pulping Pulse" Ability { id: "B373", source: "Vamp Fatale" }
398.8 "Hell in a Cell" Ability { id: "B395", source: "Vamp Fatale" }
400.0 "Bloody Bondage" #Ability { id: "B396", source: "Vamp Fatale" }
400.0 "Bloody Bondage" #Ability { id: "B396", source: "Vamp Fatale" }
401.6 "--cell x4--"
407.1 "--sync--" Ability { id: "B39C", source: "Vamp Fatale" } jump "r9s-ultrasonic-spread-1"
407.1 "--sync--" Ability { id: "B39D", source: "Vamp Fatale" } jump "r9s-ultrasonic-amp-1"
407.9 "Ultrasonic Spread/Ultrasonic Amp?" #Ability { id: ["B39E", "B39F"], source: "Vamp Fatale" }
414.2 "--sync--" #Ability { id: ["B39D", "B39C"], source: "Vamp Fatale" }
415.0 "Ultrasonic Amp/Ultrasonic Spread?" #Ability { id: ["B39F", "B39E"], source: "Vamp Fatale" }
421.1 "Hell in a Cell" #Ability { id: "B395", source: "Vamp Fatale" }
422.3 "Bloody Bondage" #Ability { id: "B396", source: "Vamp Fatale" }
423.9 "--cell x4--"
429.4 "--sync--" #Ability { id: ["B39C", "B39D"], source: "Vamp Fatale" }
430.2 "Ultrasonic Amp/Ultrasonic Spread?" #Ability { id: ["B39E", "B39F"], source: "Vamp Fatale" }
436.5 "--sync--" #Ability { id: ["B39D", "B39C"], source: "Vamp Fatale" }
437.3 "Ultrasonic Spread/Ultrasonic Amp?" #Ability { id: ["B39F", "B39E"], source: "Vamp Fatale" }
507.1 label "r9s-ultrasonic-spread-1"
507.9 "Ultrasonic Spread (Healer)" #Ability { id: "B39E", source: "Vamp Fatale" }
507.9 "Ultrasonic Spread (DPS)" #Ability { id: "B39E", source: "Vamp Fatale" }
507.9 "Ultrasonic Spread (Tank)" #Ability { id: "B883", source: "Vamp Fatale" }
514.2 "--sync--" Ability { id: "B39D", source: "Vamp Fatale" }
515.0 "Ultrasonic Amp" Ability { id: "B39F", source: "Vamp Fatale" }
521.1 "Hell in a Cell" Ability { id: "B395", source: "Vamp Fatale" }
522.3 "Bloody Bondage" Ability { id: "B396", source: "Vamp Fatale" }
523.9 "--cell x4--"
529.4 "--sync--" Ability { id: "B39C", source: "Vamp Fatale" } jump "r9s-ultrasonic-spread-2"
529.4 "--sync--" Ability { id: "B39D", source: "Vamp Fatale" } jump "r9s-ultrasonic-amp-2"
530.2 "Ultrasonic Amp/Ultrasonic Spread?" #Ability { id: ["B39E", "B39F"], source: "Vamp Fatale" }
536.5 "--sync--" #Ability { id: ["B39D", "B39C"], source: "Vamp Fatale" }
537.3 "Ultrasonic Spread/Ultrasonic Amp?" #Ability { id: ["B39F", "B39E"], source: "Vamp Fatale" }
542.4 "Pulping Pulse" #Ability { id: "B373", source: "Vamp Fatale" }
546.4 "Pulping Pulse" #Ability { id: "B373", source: "Vamp Fatale" }
551.4 "Undead Deathmatch" #Ability { id: "B3A0", source: "Vamp Fatale" }
552.6 "Bloody Bondage" #Ability { id: "B3A1", source: "Vamp Fatale" }
559.7 "Sanguine Scratch 1" #Ability { id: "B3A5", source: "Vamp Fatale" }
607.1 label "r9s-ultrasonic-amp-1"
607.9 "Ultrasonic Amp" Ability { id: "B39F", source: "Vamp Fatale" }
614.2 "--sync--" Ability { id: "B39C", source: "Vamp Fatale" }
615.0 "Ultrasonic Spread (Healer)" #Ability { id: "B39E", source: "Vamp Fatale" }
615.0 "Ultrasonic Spread (DPS)" #Ability { id: "B39E", source: "Vamp Fatale" }
615.0 "Ultrasonic Spread (Tank)" #Ability { id: "B883", source: "Vamp Fatale" }
621.1 "Hell in a Cell" Ability { id: "B395", source: "Vamp Fatale" }
622.3 "Bloody Bondage" Ability { id: "B396", source: "Vamp Fatale" }
623.9 "--cell x4--"
629.4 "--sync--" Ability { id: "B39C", source: "Vamp Fatale" } jump "r9s-ultrasonic-spread-2"
629.4 "--sync--" Ability { id: "B39D", source: "Vamp Fatale" } jump "r9s-ultrasonic-amp-2"
630.2 "Ultrasonic Amp/Ultrasonic Spread?" #Ability { id: ["B39E", "B39F"], source: "Vamp Fatale" }
636.5 "--sync--" #Ability { id: ["B39D", "B39C"], source: "Vamp Fatale" }
637.3 "Ultrasonic Spread/Ultrasonic Amp?" #Ability { id: ["B39F", "B39E"], source: "Vamp Fatale" }
642.4 "Pulping Pulse" #Ability { id: "B373", source: "Vamp Fatale" }
646.4 "Pulping Pulse" #Ability { id: "B373", source: "Vamp Fatale" }
651.4 "Undead Deathmatch" #Ability { id: "B3A0", source: "Vamp Fatale" }
652.6 "Bloody Bondage" #Ability { id: "B3A1", source: "Vamp Fatale" }
659.7 "Sanguine Scratch 1" #Ability { id: "B3A5", source: "Vamp Fatale" }
729.4 label "r9s-ultrasonic-spread-2"
730.2 "Ultrasonic Spread (Healer)" #Ability { id: "B39E", source: "Vamp Fatale" }
730.2 "Ultrasonic Spread (DPS)" #Ability { id: "B39E", source: "Vamp Fatale" }
730.2 "Ultrasonic Spread (Tank)" #Ability { id: "B883", source: "Vamp Fatale" }
736.5 "--sync--" Ability { id: "B39D", source: "Vamp Fatale" }
737.3 "Ultrasonic Amp" Ability { id: "B39F", source: "Vamp Fatale" }
738.4 "--sync--" StartsUsing { id: "B373", source: "Vamp Fatale" } jump "r9s-ultrasonic-end"
742.4 "Pulping Pulse" #Ability { id: "B373", source: "Vamp Fatale" }
746.4 "Pulping Pulse" #Ability { id: "B373", source: "Vamp Fatale" }
751.4 "Undead Deathmatch" #Ability { id: "B3A0", source: "Vamp Fatale" }
752.6 "Bloody Bondage" #Ability { id: "B3A1", source: "Vamp Fatale" }
759.7 "Sanguine Scratch 1" #Ability { id: "B3A5", source: "Vamp Fatale" }
762.1 "Sanguine Scratch 2" #Ability { id: "B3A7", source: "Vamp Fatale" }
764.4 "Sanguine Scratch 3" #Ability { id: "B3A7", source: "Vamp Fatale" }
766.7 "Sanguine Scratch 4" #Ability { id: "B3A7", source: "Vamp Fatale" }
829.4 label "r9s-ultrasonic-amp-2"
830.2 "Ultrasonic Amp" Ability { id: "B39F", source: "Vamp Fatale" }
836.5 "--sync--" Ability { id: "B39C", source: "Vamp Fatale" }
837.3 "Ultrasonic Spread (Healer)" #Ability { id: "B39E", source: "Vamp Fatale" }
837.3 "Ultrasonic Spread (DPS)" #Ability { id: "B39E", source: "Vamp Fatale" }
837.3 "Ultrasonic Spread (Tank)" #Ability { id: "B883", source: "Vamp Fatale" }
838.4 label "r9s-ultrasonic-end"
842.4 "Pulping Pulse" Ability { id: "B373", source: "Vamp Fatale" }
846.4 "Pulping Pulse" Ability { id: "B373", source: "Vamp Fatale" }
# Undead Deathmatch
851.4 "Undead Deathmatch" Ability { id: "B3A0", source: "Vamp Fatale" } window 900,3
852.6 "Bloody Bondage" Ability { id: "B3A1", source: "Vamp Fatale" }
859.7 "Sanguine Scratch 1" Ability { id: "B3A5", source: "Vamp Fatale" }
862.1 "Sanguine Scratch 2" #Ability { id: "B3A7", source: "Vamp Fatale" }
864.4 "Sanguine Scratch 3" #Ability { id: "B3A7", source: "Vamp Fatale" }
866.7 "Sanguine Scratch 4" #Ability { id: "B3A7", source: "Vamp Fatale" }
869.0 "Sanguine Scratch 5" #Ability { id: "B3A7", source: "Vamp Fatale" }
871.9 "Breakdown Drop" Ability { id: "B3A8", source: "Vampette Fatale" }
871.9 "Breakwing Beat" #Ability { id: "B3A9", source: "Vampette Fatale" }
877.7 "Sanguine Scratch 1" Ability { id: "B3A5", source: "Vamp Fatale" }
880.1 "Sanguine Scratch 2" #Ability { id: "B3A7", source: "Vamp Fatale" }
882.4 "Sanguine Scratch 3" #Ability { id: "B3A7", source: "Vamp Fatale" }
884.7 "Sanguine Scratch 4" #Ability { id: "B3A7", source: "Vamp Fatale" }
887.0 "Sanguine Scratch 5" #Ability { id: "B3A7", source: "Vamp Fatale" }
890.0 "Breakdown Drop" Ability { id: "B3AA", source: "Vampette Fatale" }
890.0 "Breakwing Beat" #Ability { id: "B3AB", source: "Vampette Fatale" }
896.9 "Brutal Rain x5+" #Ability { id: "B383", source: "Vamp Fatale" } duration 4
909.9 "Vamp Stomp" Ability { id: "B374", source: "Vamp Fatale" }
910.0 "--sync--" Ability { id: "B34C", source: "Vamp Fatale" }
914.0 "Blast Beat" Ability { id: "B375", source: "Vampette Fatale" }
917.4 "Blast Beat" Ability { id: "B375", source: "Vampette Fatale" }
921.0 "Blast Beat" Ability { id: "B375", source: "Vampette Fatale" }
925.2 "--sync--" Ability { id: "B34F", source: "Vamp Fatale" }
926.0 "Half Moon" Ability { id: "B379", source: "Vamp Fatale" }
929.0 "Half Moon" Ability { id: "B37A", source: "Vamp Fatale" }
936.1 "Hardcore" Ability { id: "B380", source: "Vamp Fatale" }
941.1 "Pulping Pulse" Ability { id: "B373", source: "Vamp Fatale" }
942.2 "--middle--" Ability { id: "B332", source: "Vamp Fatale" }
948.3 "Sanguine Scratch 1" Ability { id: "B3A5", source: "Vamp Fatale" }
950.7 "Sanguine Scratch 2" #Ability { id: "B3A7", source: "Vamp Fatale" }
953.0 "Sanguine Scratch 3" #Ability { id: "B3A7", source: "Vamp Fatale" }
955.3 "Sanguine Scratch 4" #Ability { id: "B3A7", source: "Vamp Fatale" }
957.6 "Sanguine Scratch 5" #Ability { id: "B3A7", source: "Vamp Fatale" }
968.4 "Insatiable Thirst" Ability { id: "B372", source: "Vamp Fatale" }
# Back to normal
973.4 "--middle--" Ability { id: "B332", source: "Vamp Fatale" }
982.5 "Crowd Kill" Ability { id: "B36D", source: "Vamp Fatale" }
991.2 "--sync--" StartsUsing { id: "B36E", source: "Vamp Fatale" } window 10,10
1001.2 "Finale Fatale (Enrage)" Ability { id: "B36E", source: "Vamp Fatale" }
1002.3 "Finale Fatale (Enrage)" Ability { id: "B371", source: "Vamp Fatale" }
# IGNORED ABILITIES
# B333 Sadistic Screech: VFX
# B35A Hardcore: VFX, tankbuster
# B34A Vamp Stomp: VFX
# B376 Blast Beat: Curse of the Bombpyre (1279) cleansed by player
# B35D Brutal Rain: VFX
# B705 Dead Wake: VFX
# B344 Insatiable Thirst: VFX
# B706 Coffinfiller: VFX
# B709 Electrocution
# B36B Gravegrazer
# B36C Gravegrazer
# B38C Massive Impact: failing to soak Fatal Flail tower
# B38D Barbed Burst: failing to kill Fatal Flail
# B38F Aetherletting: VFX for protean casts
# B390 Aetherletting: VFX for dropping cross aoe
# B393 Aetherletting, cross aoe inferred by duration of B392
# B3A2 Unmitigated Explosion: no one stands in Undead Deathmatch tower
# B397 Unmitigated Explosion: failing to soak a tower
# B398 Naughty Knot: Attempting to run out of the Charnel Cell
# B399 Blood Lash: tank Charnel Cell autos
# B39A Blood Lash: healer Charnel Cell autos
# B39B Blood Lash: dps Chanel Cell autos
# B33E Crowd Kill: VFX
# B340 Finale Fatale: VFX for small
# B341 Finale Fatale: VFX for big
# B3A3 Explosion: failing to kill Deadly Doornail
# B3A4 Sanguine Scratch: VFX
# B3A6 Sanguine Scratch: VFX, protean
# B7C8 --sync-- Auto-attack from boss
# BBA7 --sync-- Auto-attack from boss
# ALL ENCOUNTER ABILITIES
# B332 --sync--
# B333 Sadistic Screech
# B33E Crowd Kill
# B340 Finale Fatale (small)
# B341 Finale Fatale (big)
# B344 Insatiable Thirst
# B34A Vamp Stomp
# B34C --sync--
# B34E Half Moon: VFX for B377 => B378, Small
# B34F Half Moon: VFX for B379 => B37A, Big
# B350 Half Moon: VFX for B37B => B37C, Small
# B351 Half Moon: VFX for B37D => B37E, Big
# B35A Hardcore
# B35D Brutal Rain
# B366 Sadistic Screech
# B367 Dead Wake
# B368 Coffinfiller
# B369 Coffinfiller
# B36A Coffinfiller
# B36B Gravegrazer
# B36C Gravegrazer
# B36D Crowd Kill
# B36E Finale Fatale: Enrage Cast
# B36F Finale Fatale (small)
# B370 Finale Fatale (big)
# B371 Finale Fatale: Enrage Damage
# B372 Insatiable Thirst
# B373 Pulping Pulse
# B374 Vamp Stomp
# B375 Blast Beat
# B376 Blast Beat
# B377 Half Moon
# B378 Half Moon
# B379 Half Moon
# B37A Half Moon
# B37B Half Moon
# B37C Half Moon
# B37D Half Moon
# B37E Half Moon
# B37F Hardcore (small tankbuster)
# B380 Hardcore (big tankbuster)
# B383 Brutal Rain
# B384 Killer Voice
# B38B Plummet
# B38C Massive Impact
# B38D Barbed Burst
# B38F Aetherletting
# B390 Aetherletting
# B391 Aetherletting
# B392 Aetherletting, player dropping Aetherletting cross aoe
# B393 Aetherletting, cross aoe
# B395 Hell in a Cell
# B396 Bloody Bondage
# B397 Unmitigated Explosion
# B398 Naughty Knot
# B399 Blood Lash
# B39A Blood Lash
# B39B Blood Lash
# B39C Ultrasonic Spread
# B39D Ultrasonic Amp, VFX
# B39E Ultrasonic Spread (Healer and DPS targetted)
# B39F Ultrasonic Amp
# B3A0 Undead Deathmatch
# B3A1 Bloody Bondage
# B3A2 Unmitigated Explosion
# B3A3 Explosion
# B3A4 Sanguine Scratch
# B3A5 Sanguine Scratch
# B3A6 Sanguine Scratch
# B3A7 Sanguine Scratch
# B3A8 Breakdown Drop
# B3A9 Breakwing Beat
# B3AA Breakdown Drop
# B3AB Breakwing Beat
# B705 Dead Wake
# B706 Coffinfiller
# B709 Electrocution
# B7C8 --sync--
# B883 Ultrasonic Spread (tank targetted)
# BBA7 --sync-
`,
  initData: () => {
    return {
      sActorPositions: {},
      sBats: { inner: [], middle: [], outer: [] },
      sPlaying: false,
      sSaw: [],
      sTetherId: 0,
      sSatisfiedCount: 0,
      sCoffinfillers: [],
      sFlailPositions: [],
      sHasHellAwaits: false,
    };
  },
  triggers: [
    {
      id: 'souma r9s Satisfied Counter',
      type: 'GainsEffect',
      netRegex: { effectId: '1277', capture: true },
      run: (data, matches) => data.sSatisfiedCount = parseInt(matches.count),
    },
    {
      id: 'souma r9s Headmarker Stack 0131',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData['0131'], capture: true },
      response: Responses.stackMarkerOn(),
    },
    {
      id: 'souma r9s Headmarker Tankbuster',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData['tankbuster'], capture: true },
      condition: Conditions.targetIsYou(),
      alertText: (data, _matches, output) => {
        if (data.sSatisfiedCount >= 8)
          return output.bigTankCleave();
        return output.tankCleaveOnYou();
      },
      outputStrings: {
        tankCleaveOnYou: Outputs.tankCleaveOnYou,
        bigTankCleave: {
          en: 'Tank Cleave on YOU (Big)',
          de: 'Tank Cleave auf DIR (Groß)',
          cn: '坦克范围死刑点名（大）',
          ko: '광역 탱버 대상자 (큰)',
        },
      },
    },
    {
      id: 'souma r9s Headmarker Spread 028C',
      type: 'HeadMarker',
      netRegex: { id: headMarkerData['028C'], capture: true },
      condition: Conditions.targetIsYou(),
      infoText: (_data, _matches, output) => output.seed(),
      outputStrings: {
        seed: {
          en: 'Drop seed',
          de: 'Saaten ablegen',
          fr: 'Déposez les graines',
          ja: '種捨て',
          cn: '放置冰花',
          ko: '씨앗 놓기',
          tc: '放置冰花',
        },
      },
    },
    {
      id: 'souma r9s 魅亡之音',
      type: 'StartsUsing',
      netRegex: { id: 'B384', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'souma r9s ActorSetPos Tracker',
      type: 'ActorSetPos',
      netRegex: { id: '4[0-9A-Fa-f]{7}', capture: true },
      run: (data, matches) =>
        data.sActorPositions[matches.id] = {
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          heading: parseFloat(matches.heading),
        },
    },
    {
      id: 'souma r9s ActorMove Tracker',
      type: 'ActorMove',
      netRegex: { id: '4[0-9A-Fa-f]{7}', capture: true },
      run: (data, matches) =>
        data.sActorPositions[matches.id] = {
          x: parseFloat(matches.x),
          y: parseFloat(matches.y),
          heading: parseFloat(matches.heading),
        },
    },
    {
      id: 'souma r9s Bat Tracker',
      type: 'ActorControlExtra',
      netRegex: { id: '4[0-9A-Fa-f]{7}', category: '0197', param1: '11D1', capture: true },
      run: (data, matches) => {
        const moveRads = {
          'inner': 1.5128,
          'middle': 1.5513,
          'outer': 1.5608,
        };
        const actor = data.sActorPositions[matches.id];
        if (actor === undefined)
          return;
        const dist = Math.hypot(actor.x - center.x, actor.y - center.y);
        const dLen = dist < 16 ? (dist < 8 ? 'inner' : 'middle') : 'outer';
        const angle = Math.atan2(actor.x - center.x, actor.y - center.y);
        let angleCW = angle - (Math.PI / 2);
        if (angleCW < -Math.PI)
          angleCW += Math.PI * 2;
        let angleDiff = Math.abs(angleCW - actor.heading);
        if (angleDiff > Math.PI * 1.75)
          angleDiff = Math.abs(angleDiff - (Math.PI * 2));
        const cw = angleDiff < (Math.PI / 2) ? 'cw' : 'ccw';
        const adjustRads = moveRads[dLen];
        let endAngle = angle + (adjustRads * ((cw === 'cw') ? -1 : 1));
        if (endAngle < -Math.PI)
          endAngle += Math.PI * 2;
        else if (endAngle > Math.PI)
          endAngle -= Math.PI * 2;
        data.sBats[dLen].push(
          Directions.output16Dir[Directions.hdgTo16DirNum(endAngle)] ?? 'unknown',
        );
      },
    },
    {
      id: 'souma r9s 血魅的靴踏音',
      type: 'StartsUsing',
      netRegex: { id: ['B34A', 'B374'], capture: false },
      suppressSeconds: 1,
      response: Responses.getOut('info'),
    },
    {
      id: 'souma r9s Blast Beat Middle',
      type: 'ActorControlExtra',
      netRegex: { id: '4[0-9A-Fa-f]{7}', category: '0197', param1: '11D1', capture: false },
      delaySeconds: 9.7,
      durationSeconds: 3.4,
      suppressSeconds: 1,
      infoText: (data, _matches, output) => {
        const [dir1, dir2, dir3] = data.sBats.middle;
        return output.away({
          dir1: output[dir1 ?? 'unknown'](),
          dir2: output[dir2 ?? 'unknown'](),
          dir3: output[dir3 ?? 'unknown'](),
        });
      },
      run: (data, _matches) => {
        data.sBats.middle = [];
      },
      outputStrings: {
        ...Directions.outputStrings16Dir,
        away: {
          en: 'Away from bats ${dir1}/${dir2}/${dir3}',
          de: 'Weg von den Fledermäusen ${dir1}/${dir2}/${dir3}',
          fr: 'Loin des chauves-souris ${dir1}/${dir2}/${dir3}',
          cn: '远离 ${dir1}、${dir2}、${dir3} 蝙蝠',
          ko: '박쥐 피하기 ${dir1}/${dir2}/${dir3}',
        },
      },
    },
    {
      id: 'souma r9s Blast Beat Outer',
      type: 'ActorControlExtra',
      netRegex: { id: '4[0-9A-Fa-f]{7}', category: '0197', param1: '11D1', capture: false },
      delaySeconds: 13.2,
      durationSeconds: 3.4,
      suppressSeconds: 1,
      response: Responses.goMiddle(),
      run: (data, _matches) => {
        data.sBats.outer = [];
      },
    },
    {
      id: 'souma r9s 施虐的尖啸',
      type: 'StartsUsing',
      netRegex: { id: 'B333', capture: false },
      response: Responses.bigAoe(),
      run: (data) => data.sPlaying = false,
    },
    {
      id: 'souma r9s SM start',
      type: 'SystemLogMessage',
      netRegex: { id: '2C40', capture: false },
      run: (data) => data.sPlaying = true,
    },
    {
      id: 'R9S Coffinfiller',
      type: 'StartsUsingExtra',
      netRegex: { id: ['B368', 'B369', 'B36A'], capture: true },
      suppressSeconds: (data) => data.sCoffinfillers.length === 0 ? 0 : 5,
      run: (data, matches) => {
        let danger;
        const xPos = parseFloat(matches.x);
        if (xPos < 95)
          danger = 'outerWest';
        else if (xPos < 100)
          danger = 'innerWest';
        else if (xPos < 105)
          danger = 'innerEast';
        else
          danger = 'outerEast';
        data.sCoffinfillers.push(danger);
      },
    },
    {
      id: 'souma r9s Half Moon',
      type: 'StartsUsingExtra',
      netRegex: { id: ['B377', 'B379', 'B37B', 'B37D'], capture: true },
      delaySeconds: 0.3,
      alertText: (data, matches, output) => {
        if (data.sCoffinfillers.length < 2) {
          if (matches.id === 'B377')
            return output.rightThenLeft();
          if (matches.id === 'B37B')
            return output.leftThenRight();
          return output.bigHalfmoonNoCoffin({
            dir1: output[matches.id === 'B379' ? 'right' : 'left'](),
            dir2: output[matches.id === 'B379' ? 'left' : 'right'](),
          });
        }
        const attackDirNum = Directions.hdgTo4DirNum(parseFloat(matches.heading));
        const dirNum1 = (attackDirNum + 2) % 4;
        const dir1 = Directions.outputFromCardinalNum(dirNum1);
        const dirNum2 = attackDirNum;
        const dir2 = Directions.outputFromCardinalNum(dirNum2);
        const bigCleave = matches.id === 'B379' || matches.id === 'B37D';
        const insidePositions = [
          'innerWest',
          'innerEast',
        ];
        const outsidePositions = [
          'outerWest',
          'outerEast',
        ];
        const westPositions = [
          'innerWest',
          'outerWest',
        ];
        const eastPositions = [
          'innerEast',
          'outerEast',
        ];
        let coffinSafe1 = [
          'outerWest',
          'innerWest',
          'innerEast',
          'outerEast',
        ];
        coffinSafe1 = coffinSafe1.filter((pos) => !data.sCoffinfillers.includes(pos));
        let coffinSafe2 = [
          'outerWest',
          'innerWest',
          'innerEast',
          'outerEast',
        ];
        // Whatever gets hit first round will be safe second round
        coffinSafe2 = coffinSafe2.filter((pos) => data.sCoffinfillers.includes(pos));
        data.sCoffinfillers = [];
        let dir1Text = output[dir1]();
        let dir2Text = output[dir2]();
        if (dir1 === 'dirW') {
          coffinSafe1 = coffinSafe1.filter((pos) => westPositions.includes(pos));
          dir1Text = output.leftWest();
        }
        if (dir1 === 'dirE') {
          coffinSafe1 = coffinSafe1.filter((pos) => eastPositions.includes(pos));
          dir1Text = output.rightEast();
        }
        if (dir2 === 'dirW') {
          coffinSafe2 = coffinSafe2.filter((pos) => westPositions.includes(pos));
          dir2Text = output.leftWest();
        }
        if (dir2 === 'dirE') {
          coffinSafe2 = coffinSafe2.filter((pos) => eastPositions.includes(pos));
          dir2Text = output.rightEast();
        }
        let coffin1;
        let coffin2;
        if (coffinSafe1.every((pos) => insidePositions.includes(pos)))
          coffin1 = 'inside';
        else if (coffinSafe1.every((pos) => outsidePositions.includes(pos)))
          coffin1 = 'outside';
        else
          coffin1 = coffinSafe1.find((pos) => insidePositions.includes(pos)) ?? 'unknown';
        if (coffinSafe2.every((pos) => insidePositions.includes(pos)))
          coffin2 = 'inside';
        else if (coffinSafe2.every((pos) => outsidePositions.includes(pos)))
          coffin2 = 'outside';
        else
          coffin2 = coffinSafe2.find((pos) => insidePositions.includes(pos)) ?? 'unknown';
        if (bigCleave) {
          return output.bigHalfmoonCombined({
            coffin1: output[coffin1](),
            dir1: dir1Text,
            coffin2: output[coffin2](),
            dir2: dir2Text,
          });
        }
        return output.combined({
          coffin1: output[coffin1](),
          dir1: dir1Text,
          coffin2: output[coffin2](),
          dir2: dir2Text,
        });
      },
      outputStrings: {
        ...Directions.outputStringsCardinalDir,
        text: {
          en: '${first} => ${second}',
          cn: '${first} => ${second}',
          ko: '${first} => ${second}',
        },
        combined: {
          en: '${coffin1} + ${dir1} => ${coffin2} + ${dir2}',
          cn: '${coffin1} + ${dir1} => ${coffin2} + ${dir2}',
          ko: '${coffin1} + ${dir1} => ${coffin2} + ${dir2}',
        },
        bigHalfmoonCombined: {
          en: '${coffin1} + ${dir1} (big) => ${coffin2} + ${dir2} (big)',
          cn: '${coffin1} + ${dir1} (大) => ${coffin2} + ${dir2} (大)',
          ko: '${coffin1} + ${dir1} (큰) => ${coffin2} + ${dir2} (큰)',
        },
        rightThenLeft: Outputs.rightThenLeft,
        leftThenRight: Outputs.leftThenRight,
        left: Outputs.left,
        leftWest: Outputs.leftWest,
        right: Outputs.right,
        rightEast: Outputs.rightEast,
        inside: {
          en: 'Inside',
          cn: '内侧',
          ko: '안쪽',
        },
        outside: {
          en: 'Outside',
          cn: '外侧',
          ko: '바깥쪽',
        },
        outerWest: {
          en: 'Outer West',
          cn: '左外',
          ko: '바깥 서쪽',
        },
        innerWest: {
          en: 'Inner West',
          cn: '左内',
          ko: '안 서쪽',
        },
        innerEast: {
          en: 'Inner East',
          cn: '右内',
          ko: '안 동쪽',
        },
        outerEast: {
          en: 'Outer East',
          cn: '右外',
          ko: '바깥 동쪽',
        },
        bigHalfmoonNoCoffin: {
          en: '${dir1} max melee => ${dir2} max melee',
          fr: '${dir1} max melée => ${dir2} max melée',
          cn: '${dir1} 最大近战距离 => ${dir2} 最大近战距离',
          ko: '${dir1} 칼끝딜 => ${dir2} 칼끝딜',
        },
      },
    },
    {
      id: 'souma r9s 全场杀伤',
      type: 'StartsUsing',
      netRegex: { id: 'B33E', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'souma r9s 致命的闭幕曲',
      type: 'StartsUsing',
      netRegex: { id: 'B340', capture: false },
      response: Responses.aoe(),
    },
    {
      id: 'souma r9s 致命的闭幕曲 (大)',
      type: 'StartsUsing',
      netRegex: { id: 'B341', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'souma r9s 致命的闭幕曲狂暴',
      type: 'StartsUsing',
      netRegex: { id: 'B36E', capture: false },
      countdownSeconds: 9.7,
      infoText: (_data, _matches, output) => output.text(),
      outputStrings: {
        text: {
          en: 'Enrage',
          de: 'Finalangriff',
          fr: 'Enrage',
          ja: '時間切れ',
          cn: '狂暴',
          ko: '전멸기',
          tc: '狂暴',
        },
      },
    },
    {
      id: 'souma r9s 贪欲无厌',
      type: 'StartsUsing',
      netRegex: { id: 'B344', capture: false },
      response: Responses.bigAoe(),
    },
    {
      id: 'souma r9s 刺锤',
      type: 'StartsUsingExtra',
      netRegex: { id: 'B38B', capture: true },
      preRun: (data, matches) => {
        data.sFlailPositions.push(matches);
      },
      infoText: (data, _matches, output) => {
        const [flail1Match, flail2Match] = data.sFlailPositions;
        if (flail1Match === undefined || flail2Match === undefined)
          return;
        const flail1X = parseFloat(flail1Match.x);
        const flail1Y = parseFloat(flail1Match.y);
        const flail2X = parseFloat(flail2Match.x);
        const flail2Y = parseFloat(flail2Match.y);
        const flail1Dir = Directions.xyToIntercardDirOutput(flail1X, flail1Y, center.x, center.y);
        const flail2Dir = Directions.xyToIntercardDirOutput(flail2X, flail2Y, center.x, center.y);
        const flail1Dist = Math.abs(flail1Y - center.y) < 10 ? 'near' : 'far';
        const flail2Dist = Math.abs(flail1Y - center.y) < 10 ? 'near' : 'far';
        return output.text({
          flail1Dir: output[flail1Dir](),
          flail2Dir: output[flail2Dir](),
          flail1Dist: output[flail1Dist](),
          flail2Dist: output[flail2Dist](),
        });
      },
      run: (data) => {
        if (data.sFlailPositions.length < 2)
          return;
        data.sFlailPositions = [];
      },
      outputStrings: {
        text: {
          en: 'Flails ${flail1Dist} ${flail1Dir}/${flail2Dist} ${flail2Dir}',
          de: 'Stachelbombe ${flail1Dist} ${flail1Dir}/${flail2Dist} ${flail2Dir}',
          fr: 'Fléaux ${flail1Dist} ${flail1Dir}/${flail2Dist} ${flail2Dir}',
          cn: '刺锤 ${flail1Dist}${flail1Dir}、${flail2Dist}${flail2Dir}',
          ko: '철퇴 ${flail1Dist} ${flail1Dir}/${flail2Dist} ${flail2Dir}',
        },
        near: {
          en: 'Near',
          de: 'Nah',
          fr: 'proche',
          ja: '近',
          cn: '近',
          ko: '가까이',
          tc: '近',
        },
        far: {
          en: 'Far',
          de: 'Fern',
          fr: 'loin',
          ja: '遠',
          cn: '远',
          ko: '멀리',
          tc: '遠',
        },
        ...Directions.outputStringsIntercardDir,
      },
    },
    {
      id: 'souma r9s 刚刺发射 B38D',
      type: 'StartsUsing',
      netRegex: { id: 'B38D', capture: false },
      suppressSeconds: 1,
      response: Responses.killAdds('alert'),
    },
    {
      id: 'souma r9s 血蝠死斗',
      type: 'StartsUsing',
      netRegex: { id: 'B3A0', capture: false },
      response: Responses.getTowers('alert'),
    },
    {
      id: 'souma r9s 连线',
      type: 'Tether',
      netRegex: { 'id': '0161' },
      condition: (data, matches) => data.me === matches.source,
      preRun: (data, matches) => {
        data.sTetherId = parseInt(matches.targetId, 16);
      },
    },
    {
      id: 'souma r9s 808',
      type: 'GainsEffect',
      netRegex: { effectId: '808', count: ['426', '427'] },
      condition: (data, matches) => data.sTetherId === parseInt(matches.targetId, 16),
      durationSeconds: 4,
      infoText: (_data, matches, output) => {
        const inout = matches.count === '427' ? 'in' : 'out';
        return output[inout]();
      },
      outputStrings: {
        in: { en: '月环:靠近蝙蝠' },
        out: { en: '钢铁:站目标圈' },
      },
    },
    {
      id: 'souma r9s Hell Awaits Gain Debuff Collector',
      type: 'GainsEffect',
      netRegex: { effectId: '127A', capture: true },
      condition: Conditions.targetIsYou(),
      run: (data) => {
        data.sHasHellAwaits = true;
      },
    },
    {
      id: 'souma r9s Hell Awaits Lose Debuff Collector',
      type: 'GainsEffect',
      netRegex: { effectId: '127A', capture: true },
      condition: Conditions.targetIsYou(),
      delaySeconds: 13,
      run: (data) => {
        data.sHasHellAwaits = false;
      },
    },
    {
      id: 'souma r9s Ultrasonic Spread',
      type: 'StartsUsing',
      netRegex: { id: 'B39C', source: 'Vamp Fatale', capture: false },
      response: (data, _matches, output) => {
        output.responseOutputStrings = {
          rolePositions: Outputs.rolePositions,
          avoid: {
            en: 'Avoid',
            de: 'Vermeide',
            cn: '避开',
            ko: '피하기:',
          },
          text: {
            en: '${avoid}${mech}',
            de: '${avoid}${mech}',
            cn: '${avoid}${mech}',
            ko: '${avoid}${mech}',
          },
          tank: {
            en: '${mech}+死刑',
          },
        };
        if (data.role === 'tank' && !data.sHasHellAwaits)
          return {
            alertText: output.tank({
              mech: output.rolePositions(),
            }),
          };
        return {
          infoText: output.text({
            avoid: data.sHasHellAwaits ? `${output.avoid()} ` : '',
            mech: output.rolePositions(),
          }),
        };
      },
    },
    {
      id: 'R9S Ultrasonic Amp',
      type: 'StartsUsing',
      netRegex: { id: 'B39D', source: 'Vamp Fatale', capture: false },
      infoText: (data, _matches, output) => {
        return output.text({
          avoid: data.sHasHellAwaits ? `${output.avoid()} ` : '',
          mech: output.stack(),
        });
      },
      outputStrings: {
        stack: Outputs.getTogether,
        avoid: {
          en: 'Avoid',
          de: 'Vermeide',
          cn: '避开',
          ko: '피하기:',
        },
        text: {
          en: '${avoid}${mech}',
          de: '${avoid}${mech}',
          cn: '${avoid}${mech}',
          ko: '${avoid}${mech}',
        },
      },
    },
  ],
  timelineReplace: [{
    'locale': 'cn',
    'replaceSync': {
      'Charnel Cell': '致命棘狱',
      'Coffinmaker': '致命刑锯',
      'Deadly Doornail': '致命电杖',
      'Fatal Flail': '致命刺锤',
      'Vamp Fatale': '致命美人',
      'Vampette Fatale': '致命蝙蝠',
    },
    'replaceText': {
      '--coffinmaker--': '--致命刑锯--',
      '--cell': '--致命棘狱',
      '--flail': '--致命刺锤',
      '--nail--': '--致命电杖--',
      'Aetherletting(?! Proteans)': '以太流失',
      'Aetherletting Proteans': '以太流失扇形',
      'Blast Beat': '共振波',
      'Bloody Bondage': '血锁牢狱',
      'Breakdown Drop': '以太碎击',
      'Breakwing Beat': '以太碎拍',
      'Brutal Rain': '粗暴之雨',
      'Coffinfiller': '冲出',
      'Crowd Kill': '全场杀伤',
      'Dead Wake': '前进',
      'Finale Fatale': '致命的闭幕曲',
      'Half Moon': '月之半相',
      'Hardcore': '硬核之声',
      'Hell in a Cell': '笼中地狱',
      'Insatiable Thirst': '贪欲无厌',
      'Killer Voice': '魅亡之音',
      'Plummet': '掉落',
      'Pulping Pulse': '碎烂脉冲',
      'Sadistic Screech': '施虐的尖啸',
      'Sanguine Scratch': '嗜血抓挠',
      'Ultrasonic Amp': '音速集聚',
      'Ultrasonic Spread': '音速流散',
      'Undead Deathmatch': '血蝠死斗',
      'Vamp Stomp': '血魅的靴踏音',
    },
  }],
});
