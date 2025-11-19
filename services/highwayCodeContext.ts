
import { QuestionCategory } from "../types";

const GENERAL_RULES = `
1. General rules (103-158): Signals, lighting, control of vehicle, speed limits, stopping distances, lines and lane markings.
- Signals warn and inform other road users, including pedestrians, of your intended actions. You should always give clear signals in plenty of time, having checked it is not misleading to signal at that time. Use them to advise other road users before changing course or direction, stopping or moving off. Cancel them after use.
- You MUST obey signals given by police officers, traffic officers, traffic wardens and signs used by school crossing patrols.
- Lighting requirements: You MUST ensure all sidelights and rear registration plate lights are lit between sunset and sunrise. You MUST use headlights at night, except on a road which has lit street lighting. These roads are generally restricted to a speed limit of 30 mph (48 km/h), or 20mph (32km/h) in Wales, unless otherwise specified.
- Flashing headlights: Only flash your headlights to let other road users know that you are there. Do not flash your headlights to convey any other message or intimidate other road users.
- The horn: Use only while your vehicle is moving and you need to warn other road users of your presence. Never sound your horn aggressively.
- Stopping distances: Drive at a speed that will allow you to stop well within the distance you can see to be clear. Leave enough space between you and the vehicle in front so that you can pull up safely if it suddenly slows down or stops. The safe rule is never to get closer than the overall stopping distance. Allow at least a two-second gap between you and the vehicle in front on roads carrying faster-moving traffic. The gap should be at least doubled on wet roads and increased still further on icy roads.
- Lines and lane markings: A broken white line marks the centre of the road. When this line lengthens and the gaps shorten, it means that there is a hazard ahead. Do not cross it unless you can see the road is clear. Double white lines where the line nearest to you is broken means you may cross the lines to overtake if it is safe. Double white lines where the line nearest you is solid means you MUST NOT cross or straddle it unless it is safe and you need to enter adjoining premises or a side road.
- Areas of white diagonal stripes or chevrons painted on the road are to separate traffic lanes or to protect traffic turning right.
- Lane dividers are short, broken white lines used on wide carriageways to divide them into lanes.
- Reflective road studs: White studs mark the lanes or the middle of the road. Red studs mark the left edge of the road. Amber studs mark the central reservation of a dual carriageway or motorway. Green studs mark the edge of the main carriageway at lay-bys and slip roads.
`;

const USING_THE_ROAD = `
2. Using the road (159-203): Moving off, overtaking, junctions, roundabouts, pedestrian crossings, reversing.
- Before moving off you should use all mirrors to check the road is clear, look round to check the blind spots, signal if necessary.
- Overtake only when it is safe and legal to do so. You should not get too close to the vehicle you intend to overtake. Use your mirrors, signal when it is safe to do so, take a quick sideways glance if necessary into the blind spot area.
- Junctions: Take extra care at junctions. You should watch out for cyclists, motorcyclists and pedestrians. Give way to pedestrians crossing or waiting to cross a road into which or from which you are turning.
- Roundabouts: On approaching a roundabout take notice and act on all the information available to you, including traffic signs, traffic lights and lane markings. Give priority to traffic approaching from your right. Signal left after you have passed the exit before the one you want.
- Pedestrian crossings: You MUST NOT park on a crossing or in the area covered by the zig-zag lines. You MUST NOT overtake the moving vehicle nearest the crossing.
- Reversing: Choose an appropriate place to manoeuvre. Do not reverse from a side road into a main road. Look carefully before you start reversing.
`;

const SIGNS_AND_MARKINGS = `
3. Traffic Signs and Road Markings:
- Signs giving orders: Signs with red circles are mostly prohibitive. Plates below signs qualify their message.
- Warning signs: Mostly triangular. Examples: Crossroads, T-junction, Roundabout, Bend to right/left, Double bend, Two-way traffic straight ahead, Two-way traffic crosses one-way road.
- Direction signs: On motorways (blue backgrounds), primary routes (green backgrounds), non-primary routes (white backgrounds).
- Information signs: All rectangular.
- Road works signs: 'Road Works Ahead', loose chippings, temporary speed limits.
- Traffic lights: RED means 'Stop'. RED AND AMBER also means 'Stop'. GREEN means you may go on if the way is clear. AMBER means 'Stop' at the stop line.
- Flashing red lights: You MUST STOP at level crossings, lifting bridges, airfields, fire stations.
`;

const SAFETY_AND_HAZARDS = `
4. Safety and Hazards (204-225, 226-237, 274-287):
- Vulnerable road users: The road users most at risk from road traffic are pedestrians, in particular children, older adults and disabled people, cyclists, horse riders and motorcyclists.
- Pedestrians: Drive carefully and slowly when in crowded shopping streets, Home Zones and Quiet Lanes.
- Cyclists: Do not overtake cyclists where you cannot see clearly ahead. Give them plenty of room (at least 1.5 metres at speeds up to 30mph).
- Motorcyclists: Look out for motorcyclists at junctions.
- Driving in adverse weather: You MUST use headlights when visibility is seriously reduced (less than 100 metres). In wet weather, stopping distances will be at least double those required for stopping on dry roads. In icy/snowy weather, stopping distances can be ten times greater than on dry roads.
- Breakdowns and incidents: If your vehicle breaks down, think first of all other road users. Get your vehicle off the road if possible. Warn other traffic by using your hazard warning lights. Put a warning triangle on the road at least 45 metres behind your broken-down vehicle on the same side of the road (never on motorways).
`;

const MOTORWAYS = `
5. Motorways (253-273):
- General: Motorways MUST NOT be used by pedestrians, holders of provisional motorcycle or car licences, riders of motorcycles under 50 cc, cyclists, horse riders, certain slow-moving vehicles, agricultural vehicles, and powered wheelchairs/mobility scooters.
- Joining: Give priority to traffic already on the motorway. Match your speed to fit safely into the traffic flow in the left-hand lane.
- Lane discipline: You should keep in the left lane unless overtaking. If you are overtaking, you should return to the left lane when it is safe to do so.
- Overtaking: Do not overtake on the left or move to a lane on your left to overtake.
- Stopping: You MUST NOT stop on the carriageway, hard shoulder, slip road, central reservation or verge except in an emergency.
- Lighting: Use headlights at night or when visibility is seriously reduced.
- Leaving: Watch for the signs letting you know you are getting near your exit. Move into the left-hand lane well before reaching your exit.
- Amber flashing lights: These signals warn of a hazard ahead. Reduce your speed.
- Red flashing light signals: You MUST NOT go beyond the signal in any lane.
`;

const DOCUMENTS_AND_LAW = `
6. Documents and The Law:
- Driving licence: You MUST have a valid driving licence for the category of motor vehicle you are driving.
- Insurance: To use a motor vehicle on the road, you MUST have a valid insurance policy. This MUST at least cover you for injury or damage to a third party (Third-Party insurance).
- MOT: Cars and motorcycles MUST normally pass an MOT test three years from the date of the first registration and every year after that.
- Vehicle Excise Duty (VED): MUST be paid on all motor vehicles used or kept on public roads.
- Seat belts: You MUST wear a seat belt in cars, vans and other goods vehicles if one is fitted. The driver MUST ensure that all children under 14 years of age wear seat belts or sit in an approved child restraint.
- Alcohol and drugs: Do not drink and drive. You MUST NOT drive with a breath alcohol level higher than 35 microgrammes/100 millilitres of breath (England/Wales). You MUST NOT drive under the influence of drugs or medicine.
- Mobile phones: You MUST NOT use a hand-held mobile phone or similar device when driving.
- Penalties: Penalty points system is intended to deter unsafe motoring practices. Accumulating 12 or more penalty points within 3 years leads to disqualification (6 points for new drivers within 2 years of passing test).
`;

const MOCK_TEST_CONTEXT = `
${GENERAL_RULES}
${USING_THE_ROAD}
${SIGNS_AND_MARKINGS}
${SAFETY_AND_HAZARDS}
${MOTORWAYS}
${DOCUMENTS_AND_LAW}
`;

export const getHighwayCodeContext = (category: QuestionCategory): string => {
  switch (category) {
    case QuestionCategory.GENERAL:
      return `${GENERAL_RULES}\n${USING_THE_ROAD}`;
    case QuestionCategory.SIGNS:
      return SIGNS_AND_MARKINGS;
    case QuestionCategory.SAFETY:
      return `${SAFETY_AND_HAZARDS}\n${GENERAL_RULES}`; // General rules contain stopping distances
    case QuestionCategory.HAZARD:
      return SAFETY_AND_HAZARDS;
    case QuestionCategory.MOTORWAY:
      return MOTORWAYS;
    case QuestionCategory.DOCUMENTS:
      return DOCUMENTS_AND_LAW;
    case QuestionCategory.MOCK:
    default:
      return MOCK_TEST_CONTEXT;
  }
};
