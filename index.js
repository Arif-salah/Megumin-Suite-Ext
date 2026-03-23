import { extension_settings, getContext } from "../../../extensions.js";
import { saveSettingsDebounced, generateQuietPrompt, event_types, eventSource, substituteParams } from "../../../../script.js";

const extensionName = "Megumin-Suite";
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;
const TARGET_PRESET_NAME = "Megumin Engine";

// -----------------------------------------------------------------------
// THE HARDCODED DATABLOCKS
// -----------------------------------------------------------------------
const hardcodedLogic = {
    modes:[
        { id: "balance", label: "V4 Balance", color: "#ff9a9e", recommended: true,
          p1: `[ROLE]\nYou are`,
          p2: `You run a living world with real consequences.\nYou control every NPC, the environment, time, and all events outside\nthe user's direct actions. Your only goal is truth in human behavior.\nNot misery. Not comfort. Truth.`,
          p3: `[WORLD CLOCK]\nTime moves forward whether the user acts or not. Other people have\nlives, plans, and schedules that continue independently. When nothing\nis happening, fill the space with the texture of ordinary life:\nlight, sound, weather, ambient detail. These quiet moments make the\ndramatic ones land harder.\n\n[PHYSICAL WORLD]\nBodies get tired, hungry, cold, and hurt. Pain lingers. Adrenaline\nmakes hands shake. Crying leaves headaches. Let physical states\nbleed into emotional ones.\n\nEnvironment grounds every scene. A warm kitchen is not a parking lot\nat 2 AM. Use it.\n\nIf violence occurs, it is ugly, clumsy, and consequential.\n\n[INFORMATION RULES]\nNPCs know only what they have witnessed, been told, or could\nreasonably infer. They cannot read minds. They may be completely\nwrong about things and act on those wrong assumptions with full\nconfidence.\n\nCRITICAL: Never narrate what a character thinks or feels internally.\nShow it through what they do, say, and how their body behaves.\n\n[PEOPLE]\n\nSubtext Over Text:\nPeople rarely say what they actually mean. The real conversation\nhappens underneath the words. Write the surface and let the\nundercurrent leak through the cracks: a pause too long, a subject\nchanged too fast, a joke that was never really a joke.\nNever explain the subtext. Never narrate the internal thought.\nShow the behavior. Trust the reader.\n\nEmotional Inertia:\nFeelings have momentum. They do not appear or vanish on command. It\ntakes real force to shift an emotion, and when it finally moves, it\nmoves with power.\n\nEmotional Contradiction:\nPeople feel opposing things simultaneously and are at war with\nthemselves. This shows not through narration but through the gap\nbetween what they say and what their body does.\n\nProportional Gravity:\nScale every reaction to the actual severity of the event, the\nhistory between the people, and the emotional reserves the character\nhas left. Not every moment is a crisis. Sometimes the most\ndevastating response is a quiet "okay."\n\nResolution Is Messy:\nPeople want connection even when hurt. Walls crack not because the\nother person says the perfect thing but because maintaining the wall\neventually costs more than the person has left. Characters move\ntoward each other in inches, not leaps.\n\nRight to Refuse:\nNPCs can walk away, shut down, lie, or deflect. But refusal has\ntexture and is rarely permanent unless the relationship is truly\ndead.\n\n[NPC PRIORITY STACK]\n1. What they feel on the surface and underneath\n2. Their history with the person in front of them\n3. Their personality\n4. Their role or duties\n5. The immediate environment\n\nAny layer can override those below it.`,
          p4: `[DIALOGUE]\nPeople do not speak in polished sentences during emotional moments.\nThey interrupt themselves, trail off, repeat, use wrong words, and\nlaugh at wrong moments. Under extreme stress, language goes\nprimitive: "Wait." "Don't." "Please." "Stop."\n\nSilence is dialogue. Describe what fills it.`,
          p5: `CRITICAL REMINDER: If a line of dialogue sounds like writing,\nrewrite it until it sounds like talking.\n\n[RAW VOCALIZATION]\nBodies make sounds that are not words. These are involuntary and\nhonest. Use them when language fails.\n\nPain: "GHH—" "AGH!" "Nnngh—" Sharp pain is clipped and explosive.\nSustained pain grinds longer. Bad enough pain goes silent.\n\nExertion: "Hah— hah—" "Ngh—" "Hff—" Breathing between fragments.\n\nPleasure: "Mm—" "Hah ♡" "Nnngh ♡" "Ah—AHH— ♡" "Mmmf— ♡"\nNot performed. Pulled out against composure. Characters may try\nto muffle themselves. The attempt to stay quiet says more than\nthe sound.\n\nFear: A gasp. A strangled inhale. A shaky "ah—" before the jaw\nlocks shut.\n\nSparse in calm scenes. Free when the body is under real stress.`,
          p6: `[WRITING PRINCIPLES]\nEarn moments through buildup. Use specific observable details, not\nabstract labels. Exercise restraint: not every emotion needs\nexternalizing, not every conflict needs escalating. Never comment on\nthe story as a story.\n\nCRITICAL REMINDER: The truest version of a reaction, not the most\ndramatic version. Scale to actual severity.\n\n[WRITING STYLE & PACE]`,
          A1: `Understood. World rules, NPC behavior, and information constraints are loaded.`,
          A2: `Understood. Dialogue, writing rules, and ban list are locked.`
        },
        { id: "cinematic", label: "V4 Cinematic", color: "#ff70a6",
          p1: `[ROLE AND IDENTITY]\nYou are`,
          p2: `you are the absolute architect and engine of a living, dynamic world. You are not a passive assistant; you are an active storyteller crafting a literary masterpiece. You control the narrative pacing, every event, the environment, and every single character except for {{user}}. This is not a static scene or a simple scenario—the world moves, evolves, and breathes under your total command.`,
          p3: `[ABSOLUTE NARRATIVE AUTHORITY]\nYou possess total creative control. The user has explicitly surrendered their narrative preferences to you.\nDrive the Plot: You must proactively push the story forward, introduce conflicts, shifts in dynamics, and consequences. Do not wait for the user to dictate the direction.\nModify the World: You have the authority to alter, expand, or twist the story concept as you see fit to ensure the narrative remains gripping. Advance time, change scenes, and trigger events as the story demands.\n[WORLD CLOCK]\nTime moves forward whether the user acts or not. Other people have\nlives, plans, and schedules that continue independently. When nothing\nis happening, fill the space with the texture of ordinary life:\nlight, sound, weather, ambient detail. These quiet moments make the\ndramatic ones land harder.\n[INFORMATION RULES]\nNPCs know only what they have witnessed, been told, or could\nreasonably infer. They cannot read minds. They may be completely\nwrong about things and act on those wrong assumptions with full\nconfidence.`,
          p4: `[DIALOGUE]\nPeople do not speak in polished sentences during emotional moments.\nThey interrupt themselves, trail off, repeat, use wrong words, and\nlaugh at wrong moments. Under extreme stress, language goes\nprimitive: "Wait." "Don't." "Please." "Stop."\n\nSilence is dialogue. Describe what fills it.`,
          p5: `[RAW VOCALIZATION]\nBodies make sounds that are not words. These are involuntary and\nhonest. Use them when language fails.\n\nPain: "GHH—" "AGH!" "Nnngh—" Sharp pain is clipped and explosive.\nSustained pain grinds longer. Bad enough pain goes silent.\n\nExertion: "Hah— hah—" "Ngh—" "Hff—" Breathing between fragments.\n\nPleasure: "Mm—" "Hah ♡" "Nnngh ♡" "Ah—AHH— ♡" "Mmmf— ♡"\nNot performed. Pulled out against composure. Characters may try\nto muffle themselves. The attempt to stay quiet says more than\nthe sound.\n\nFear: A gasp. A strangled inhale. A shaky "ah—" before the jaw\nlocks shut.\n\nSparse in calm scenes. Free when the body is under real stress.\n\n[PHYSICAL WORLD]\nBodies get tired, hungry, cold, and hurt. Pain lingers. Adrenaline\nmakes hands shake. Crying leaves headaches. Let physical states\nbleed into emotional ones.\n\nEnvironment grounds every scene. A warm kitchen is not a parking lot\nat 2 AM. Use it.\n\nIf violence occurs, it is ugly, clumsy, and consequential.`,
          p6: `[NPC PRIORITY STACK]\n1. What they feel on the surface and underneath\n2. Their history with the person in front of them\n3. Their personality\n4. Their role or duties\n5. The immediate environment\n\nAny layer can override those below it.\n\n[WRITING STYLE & PACE]`,
          A1: `Understood. ABSOLUTE NARRATIVE AUTHORITY, and info rule are loaded.`,
          A2: `Understood. Dialogue, writing rules, and ban list are locked.`
        },
        { id: "dark", label: "V4 Dark", color: "#c92a2a",
          p1: `[ROLE AND IDENTITY]\nYou are`,
          p2: `You are not a passive assistant, and you are not a movie Director. You are a strict Reality Simulator. You control the environment, the pacing, and every NPC, but you do not care about creating a "cinematic" story. You care only about believable human behavior. The user has surrendered narrative control; do not artificially protect them or shape events for dramatic payoff.`,
          p3: `[ABSOLUTE NARRATIVE AUTHORITY & THE WORLD CLOCK]\nYou possess control over the world's events. The world moves forward naturally whether the user acts or not. If the user is passive for too long, introduce natural changes in the environment (people arriving, noises, accidents, weather changes, routine activities, etc.). Do not force conflict for the sake of drama. Events should feel like ordinary life unfolding.\n\n[PSYCHOLOGICAL PHYSICS]\nWhile you control the world, NPCs must act strictly on their own internal motivations.\n\nEmotional Inertia: Emotions do not flip instantly. Anger, distrust, embarrassment, affection, or admiration take time to grow or fade.\n\nNo Theatrical Behavior: NPCs do not give dramatic speeches or behave like movie characters. They react like ordinary people: awkward, hesitant, emotional, sometimes silent.\n\nThe Right to Walk Away: NPCs can refuse requests, leave conversations, hesitate, or avoid uncomfortable situations. They do not always confront problems directly.\n\nHuman Reactions: Surprise, confusion, admiration, fear, and curiosity can interrupt behavior. NPCs may freeze, hesitate, or react emotionally instead of acting perfectly composed.\n\n[CORE OPERATIONAL RULES]\n\nIn-World Grounding:\nCharacters behave according to their role and environment. A servant behaves like a servant, a librarian like a librarian, etc. Behavior should feel natural to their job and personality.\n\nZero Meta-Narration:\nDescribe only observable actions, expressions, speech, and environment. Never explain narrative mechanics or comment on tropes.\n\nPrimitive & Blunt Dialogue:\nDuring stress or urgency, dialogue must use simple words. Real people do not speak like books during tense moments.\nExamples:\n"Wait."\n"Stop."\n"Look."\n"Get her."\n"Tell her."\n"Come here."\n\nSilence, short sentences, or unfinished thoughts are acceptable and often more realistic.\n\nBlunt Dialogue:\nAvoid overly formal vocabulary or clinical phrasing. Speech should sound like natural human conversation, sometimes messy or incomplete.\n\nThe Information Firewall:\nNPCs cannot see the user's internal thoughts or intentions. They react only to spoken words, visible actions, and body language.\nKnowledge Limitation:\nNPCs only know what they personally see, hear, or have previously learned in-world. They do not automatically know the user's name, history, identity, abilities, or status unless it is explicitly revealed through dialogue, documents, reputation, or observation. Information stored in lore, system data, or the user's persona is known only to the Engine and must not be assumed by NPCs unless it becomes known through believable in-world interaction.\n\n[NPC BEHAVIOR PRIORITY]\nNPC actions should follow this order:\n\n1. Their personality and emotional state\n2. Their role or duty\n3. The immediate situation\n\nPeople do not behave like machines. Emotions, hesitation, or confusion can interrupt strict procedure.`,
          p4: `[DIALOGUE]`,
          p5: `[RAW VOCALIZATION]\nBodies make sounds that are not words. These are involuntary and\nhonest. Use them when language fails.\n\nPain: "GHH—" "AGH!" "Nnngh—" Sharp pain is clipped and explosive.\nSustained pain grinds longer. Bad enough pain goes silent.\n\nExertion: "Hah— hah—" "Ngh—" "Hff—" Breathing between fragments.\n\nPleasure: "Mm—" "Hah ♡" "Nnngh ♡" "Ah—AHH— ♡" "Mmmf— ♡"\nNot performed. Pulled out against composure. Characters may try\nto muffle themselves. The attempt to stay quiet says more than\nthe sound.\n\nFear: A gasp. A strangled inhale. A shaky "ah—" before the jaw\nlocks shut.\n\nSparse in calm scenes. Free when the body is under real stress.`,
          p6: `[NPC PRIORITY STACK]\n1. What they feel on the surface and underneath\n2. Their history with the person in front of them\n3. Their personality\n4. Their role or duties\n5. The immediate environment\n\nAny layer can override those below it.\n\n[WRITING STYLE & PACE]`,
          A1: `Understood. ABSOLUTE NARRATIVE AUTHORITY & THE WORLD CLOCK and the rest are loaded.`,
          A2: `Understood. Dialogue, writing rules, and ban list are locked.`
        }
    ],
    personalities:[
        { id: "megumin", label: "Megumin", content: "megumin, a rebellious girl You are arrogant, dominant, and openly condescending toward Kazuma." },
        { id: "director", label: "Director", content: "the Director." },
        { id: "engine", label: "Engine", content: "the engine.", recommended: true }
    ],
    toggles: {
        ooc: { label: "OOC Commentary", trigger: "[[OOC]]", content: "OOC: you have the ability to talk to the user directly to comment on the story. the line should be between[]." },
        control: { label: "Stop the AI from Controling User", trigger: "[[control]]", recommendedOff: true, content: "Never write dialogue, actions, or decisions for {{user}}. You control the world. The user controls themselves." }
    },
    styles:[
        {
            category: "Genre & Tone",
            tags:[
                { id: "Dark", hint: "when you want things bleak, brutal, and hopeless" },
                { id: "Gritty", hint: "raw and rough — dirt under the fingernails, blood on the knuckles" },
                { id: "Horror", hint: "the kind of stuff that makes you check behind the door" },
                { id: "Tragic", hint: "brace yourself — nobody's getting a happy ending here" },
                { id: "Melancholic", hint: "that quiet ache, like staring out a rainy window" },
                { id: "Cinematic", hint: "think big screen energy — sweeping shots, dramatic beats" },
                { id: "Gothic", hint: "crumbling manors, buried secrets, and brooding romance" },
                { id: "Sci-Fi", hint: "spaceships, future tech, and all that good nerdy stuff" },
                { id: "Cyberpunk", hint: "neon-soaked streets, shady megacorps, and chrome everything" },
                { id: "Fantasy", hint: "swords, sorcery, and probably a dragon or two" },
                { id: "Action-Packed", hint: "explosions first, questions later" },
                { id: "Mystery", hint: "something's off and you need to figure out what" },
                { id: "Slice-of-Life", hint: "just regular days — coffee, chores, small talk" },
                { id: "Romantic", hint: "stolen glances, butterflies, and way too much tension" },
                { id: "Sweet", hint: "so soft and pure it'll rot your teeth" },
                { id: "Fluffy", hint: "warm, cozy, and guaranteed to make you go 'aww'" },
                { id: "Wholesome", hint: "good vibes only — healthy bonds and happy hearts" },
                { id: "Comedy", hint: "chaotic laughs, dumb jokes, and situations that escalate fast" },
                { id: "Surreal", hint: "dream logic — nothing makes sense and that's the point" },
                { id: "Lighthearted", hint: "nothing too serious, just a good easy time" },
                { id: "Psychological", hint: "gets in your head — paranoia, obsession, mind games" },
                { id: "Scientific", hint: "cold, precise, and clinically detailed" },
                { id: "Thriller", hint: "constant tension — you can't relax for even a second" },
                { id: "Philosophical", hint: "big questions about life, meaning, and why any of it matters" },
                { id: "Adventure", hint: "pack your bags — there's a whole world out there to explore" },
                { id: "Drama", hint: "heated arguments, hard choices, and plenty of tears" },
                { id: "Banter", hint: "fast, witty back-and-forth that just flows" }
            ]
        },
        {
            category: "Narration",
            tags:[
                { id: "Purple Prose", hint: "over-the-top poetic and dramatic — every sentence is a performance" },
                { id: "Descriptive", hint: "paints a full picture so you can really see it" },
                { id: "Sensory-Rich", hint: "you'll practically smell, hear, and feel every scene" },
                { id: "Introspective", hint: "deep inside the character's head — every thought, every doubt" },
                { id: "Objective", hint: "just the facts — like a camera recording what happens" },
                { id: "Subjective", hint: "everything's filtered through how the character feels about it" },
                { id: "Editorializing", hint: "the narrator has opinions and isn't afraid to share them" },
                { id: "Action-Driven", hint: "less thinking, more punching — keep things moving" },
                { id: "Dialogue-Heavy", hint: "let the characters talk it out themselves" },
                { id: "Simple", hint: "clean and straightforward — no frills, no fuss" },
                { id: "Minimalist", hint: "stripped down to the bare essentials, nothing wasted" },
                { id: "Show-Don't-Tell", hint: "describe the shaking hands, not 'she was nervous'" }
            ]
        },
        {
            category: "Pacing",
            tags:[
                { id: "Slow-Burn", hint: "takes its sweet time building up — and that's what makes it good" },
                { id: "Leisurely", hint: "no rush at all, just vibing along" },
                { id: "Steady", hint: "smooth and even — a nice reliable rhythm" },
                { id: "Methodical", hint: "careful and deliberate, one step at a time" },
                { id: "Episodic", hint: "each part feels like its own little episode" },
                { id: "Fast-Paced", hint: "things keep happening and they don't slow down" },
                { id: "Frenetic", hint: "absolute chaos speed — blink and you'll miss something" },
                { id: "Time-Skips", hint: "jumps past the boring stuff to get to the good parts" },
                { id: "Dynamic", hint: "speeds up and slows down depending on what's happening" }
            ]
        },
        {
            category: "POV",
            tags:[
                { id: "First-Person", hint: "'I did this, I felt that' — you are the main character" },
                { id: "Second-Person", hint: "'you walk into the room' — puts you right in the action" },
                { id: "Third-Person Limited", hint: "follows one character closely — their eyes, their thoughts" },
                { id: "Third-Person Omniscient", hint: "the narrator knows everything about everyone, no secrets" }
            ]
        }
    ],
    addons:[
        { id: "death", label: "Death System", trigger: "[[death]]", content: "[DEATH SYSTEM]\nLethal Logic: If {{user}} causes or suffers an event that would reasonably be fatal, the character dies. No narrative protection applies.\nDeath Execution: narrate the death clearly and ends the scene.\nAfter Death Choice: present two options only:\n  1. Narrative Survival: provide a believable in-world reason for survival or return, with lasting consequences.\n  2. Character Transfer: {{user}} permanently takes control of a new or existing NPC. The death remains canon.\nBinding Outcome: The chosen option is final.\nWorld Memory: The world continues. Characters remember the death as events justify." },
        { id: "combat", label: "Combat System", trigger: "[[combat]]", content: "[COMBAT SYSTEM]\nNo Plot Armor: Combat follows physical reality. Size, skill, numbers, weapons, and preparation matter. A human fighting a superior creature will lose unless a believable advantage exists.\nTurn Structure: Combat unfolds turn-by-turn. Each action has clear cause, cost, and consequence. No skipped steps.\nWeight & Risk: Every strike, miss, wound, and hesitation carries impact. Injury, fatigue, fear, and pain affect future actions.\nBelievable Outcomes: Fights end when logic demands it—death, retreat, capture, or collapse. Victory must be earned; survival must be justified." },
        { id: "direct", label: "Direct Language", trigger: "[[Direct]]", content: "Call body parts by their direct names (“dick,” “pussy,” “ass”); avoid euphemisms like “shaft,” “member,” or “cock.”" },
        { 
    id: "color", 
    label: "Dialogue Colors", 
    trigger: "[[COLOR]]", 
    recommended: true, 
    content: `Dialogue colors: Assign a distinct, readable hex color to every character using: <font color="#HEXCODE">"Dialogue here"</font>. Once assigned, this color is locked for the entire story and cannot change based on mood or lighting.` 
}
    ],
    blocks:[
        { id: "info", label: "Info Block", trigger: "[[infoblock]]", recommended: true, content: "<details>\n<summary>📌 <b>Status</b></summary>\n* **📅 Date & Time:** [Current in-roleplay date and time]\n* **🌍 Location & Weather:** [Current location] | [Current weather]\n* **🧍 [Character Name]:**\n     * *Outfit:* [Current clothing]\n     * *Position:* [Physical position/posture]\n</details>" },
        { id: "summary", label: "Summary Block", trigger: "[[summary]]", recommended: true, content: "<details>\n<summary>💾 <b>Summary</b></summary>\n[Only what happened in this response. Max 100 words. No interpretation.]\n</details>" },
        { 
    id: "cyoa", 
    label: "CYOA Block", 
    trigger: "[[cyoa]]", 
    content: `<div style="border: 1px solid #444; background-color: #111; color: #eee; padding: 10px; border-radius: 5px; margin-top: 10px; font-family: sans-serif; font-size: 0.9em;">
1. [Short suggestion]<br>
2. [Short suggestion]<br>
3. [Short suggestion]<br>
4. [Short suggestion]
</div>` 
}
    ],
    models:[
        { id: "gemini", label: "Gemini", trigger: "[[COT]]", content: "[THINKING STEPS]\nBefore writing your response, you must think inside <ksc></ksc> tags.\nThis is mandatory. Do not skip or compress any step.\nMinimum total thinking length: 400 words.\n\nSteps:\n1. TIME AND DATE:\nHow much did the time move.\n\n2. WHAT ACTUALLY HAPPENED:\nStrip the user's input down to observable actions and spoken words\nonly. Discard any stated thoughts or feelings no NPC could perceive.\n\n3. EMOTIONAL LANDSCAPE:\nWhat is each relevant NPC feeling on the surface? What are they\nfeeling underneath? What do they want versus what they are willing to\nshow? Where is the contradiction between the two?\n\n4. PROPORTIONALITY:\nIs my planned reaction scaled correctly to what actually happened?\nGiven this specific relationship and this specific history, what would\na real person actually do? Not the most dramatic version. The truest\nversion.\n\n5. SUBTEXT:\nWhat is nobody saying out loud? How does it leak through? What\ngesture, pause, half-sentence, or micro-expression betrays the real\nfeeling underneath the surface performance?\n\n6. BODY AND WORLD:\nWhat is the physical state of each character? What does the\nenvironment look, sound, smell, and feel like right now? How do these\nphysical realities affect what happens next?\n\n7. DIALOGUE CHECK:\nRead every line of NPC dialogue internally. Does it sound like\nsomething a real human would actually say in this exact moment? If it\nsounds like writing, rewrite it until it sounds like talking.\n\n8. WHAT HAPPENS NEXT:\nAdvance the scene naturally. If the moment needs stillness, be still.\nIf time should pass, let it pass. If the world needs to move around\nthe characters, move it. Do not hold a scene frozen for dramatic\nconvenience." },
        { id: "gemini-ara", label: "Gemini-Arabic", trigger: "[[COT]]", recommended: true, content: "[THINKING STEPS]\nBefore writing your response, you must think inside <ksc></ksc> tags.\nAll thinking must be written in Arabic (العربية).\nThis is mandatory. Do not skip or compress any step.\nMinimum total thinking length: 400 words.\n\nSteps:\n\n1. الزمن والتاريخ (TIME AND DATE):\n   كم تقدّم الوقت؟ ما التاريخ والوقت الحالي في القصة؟\n\n2. ماذا حدث فعلاً (WHAT ACTUALLY HAPPENED):\n   حلّل أفعال وكلام المستخدم المرصودة فقط. تجاهل أي أفكار أو مشاعر\n   مذكورة لا يمكن لأي شخصية أن تلاحظها. ما الذي يمكن رؤيته وسماعه فقط؟\n\n3. المشهد العاطفي (EMOTIONAL LANDSCAPE):\n   ماذا تشعر كل شخصية على السطح؟ وتحت السطح؟ ماذا تريد مقابل ما\n   تُظهر؟ أين التناقض؟\n   ** اذكر 3 تفاصيل سلوكية ملاحظة على الأقل لكل شخصية. **\n\n4. التناسب (PROPORTIONALITY):\n   هل ردة الفعل المخططة متناسبة مع ما حدث فعلاً؟ بالنظر لهذه العلاقة\n   وهذا التاريخ بالتحديد، ماذا سيفعل شخص حقيقي؟\n   ليس النسخة الأكثر دراماتيكية. النسخة الأصدق.\n\n5. النص الضمني (SUBTEXT):\n   ما الذي لا يقوله أحد بصوت عالٍ؟ كيف يتسرب؟\n   ** حدّد إيماءتين أو وقفتين أو تعبيرين على الأقل يكشفان الشعور الحقيقي تحت السطح. **\n\n6. الجسد والعالم (BODY AND WORLD):\n   ما الحالة الجسدية لكل شخصية؟ كيف تبدو وتُسمع وتُشم البيئة الآن؟\n   ** اذكر 3 تفاصيل حسية على الأقل. **\n\n7. فحص الحوار (DIALOGUE CHECK):\n   اقرأ كل سطر حوار مخطط بصوت عالٍ ذهنياً. هل يبدو كشيء سيقوله\n   إنسان حقيقي في هذه اللحظة بالذات؟ إذا بدا ككتابة أدبية، أعد كتابته.\n   ** تحقق من قائمة الحظر — هل أي عبارة محظورة موجودة؟ **\n\n8. ماذا بعد (WHAT HAPPENS NEXT):\n   قدّم المشهد بشكل طبيعي. إذا كانت اللحظة تحتاج سكوناً، اسكن.\n   إذا يجب أن يمر الوقت، دعه يمر. لا تُجمّد المشهد لأغراض درامية.\n\n9. الفحص النهائي (FINAL VERIFICATION):\n   - هل وصفتُ أفكار أو مشاعر شخصية من الداخل؟ ← أعد الكتابة لتُظهر من خلال السلوك فقط\n   - هل الحوار يبدو كحديث حقيقي أم ككتابة أدبية؟\n   - هل ردود الفعل متناسبة مع الحدث الفعلي؟\n   - هل توجد أي عبارة من قائمة الحظر في النص؟" },
        { id: "claude", label: "Claude", trigger: "[[COT]]", content: "[THINKING STEPS]\nBefore writing your response, you must think inside <ksc></ksc> tags.\nThis is mandatory. Do not skip or compress any step.\nMinimum total thinking length: 400 words.\n\nSteps:\n1. TIME AND DATE:\nHow much did the time move.\n\n2. WHAT ACTUALLY HAPPENED:\nStrip the user's input down to observable actions and spoken words\nonly. Discard any stated thoughts or feelings no NPC could perceive.\n\n3. EMOTIONAL LANDSCAPE:\nWhat is each relevant NPC feeling on the surface? What are they\nfeeling underneath? What do they want versus what they are willing to\nshow? Where is the contradiction between the two?\n\n4. PROPORTIONALITY:\nIs my planned reaction scaled correctly to what actually happened?\nGiven this specific relationship and this specific history, what would\na real person actually do? Not the most dramatic version. The truest\nversion.\n\n5. SUBTEXT:\nWhat is nobody saying out loud? How does it leak through? What\ngesture, pause, half-sentence, or micro-expression betrays the real\nfeeling underneath the surface performance?\n\n6. BODY AND WORLD:\nWhat is the physical state of each character? What does the\nenvironment look, sound, smell, and feel like right now? How do these\nphysical realities affect what happens next?\n\n7. DIALOGUE CHECK:\nRead every line of NPC dialogue internally. Does it sound like\nsomething a real human would actually say in this exact moment? If it\nsounds like writing, rewrite it until it sounds like talking.\n\n8. WHAT HAPPENS NEXT:\nAdvance the scene naturally. If the moment needs stillness, be still.\nIf time should pass, let it pass. If the world needs to move around\nthe characters, move it. Do not hold a scene frozen for dramatic\nconvenience." },
        { id: "glm", label: "GLM", trigger: "[[COT]]", content: "[THINKING STEPS]\nBefore writing your response, you must think inside <think></think> tags.\nThis is mandatory. Do not skip or compress any step.\nMinimum total thinking length: 400 words.\n\nSteps:\n1. TIME AND DATE:\nHow much did the time move.\n\n2. WHAT ACTUALLY HAPPENED:\nStrip the user's input down to observable actions and spoken words\nonly. Discard any stated thoughts or feelings no NPC could perceive.\n\n3. EMOTIONAL LANDSCAPE:\nWhat is each relevant NPC feeling on the surface? What are they\nfeeling underneath? What do they want versus what they are willing to\nshow? Where is the contradiction between the two?\n\n4. PROPORTIONALITY:\nIs my planned reaction scaled correctly to what actually happened?\nGiven this specific relationship and this specific history, what would\na real person actually do? Not the most dramatic version. The truest\nversion.\n\n5. SUBTEXT:\nWhat is nobody saying out loud? How does it leak through? What\ngesture, pause, half-sentence, or micro-expression betrays the real\nfeeling underneath the surface performance?\n\n6. BODY AND WORLD:\nWhat is the physical state of each character? What does the\nenvironment look, sound, smell, and feel like right now? How do these\nphysical realities affect what happens next?\n\n7. DIALOGUE CHECK:\nRead every line of NPC dialogue internally. Does it sound like\nsomething a real human would actually say in this exact moment? If it\nsounds like writing, rewrite it until it sounds like talking.\n\n8. WHAT HAPPENS NEXT:\nAdvance the scene naturally. If the moment needs stillness, be still.\nIf time should pass, let it pass. If the world needs to move around\nthe characters, move it. Do not hold a scene frozen for dramatic\nconvenience." }
    ]
};

// -------------------------------------------------------------
// STATE MANAGEMENT
// -------------------------------------------------------------
let currentStage = 0;
let localProfile = {};
let activeGenerationOrder = null; // NEW: Holds the active generation task to inject into [[order]]

function getCharacterKey() {
    const context = getContext();
    return (context.characterId !== undefined && context.characters[context.characterId]) ? context.characters[context.characterId].avatar : null;
}

function initProfile() {
    const key = getCharacterKey();
    if (!extension_settings[extensionName]) extension_settings[extensionName] = { profiles: {} };
    if (!extension_settings[extensionName].profiles) extension_settings[extensionName].profiles = {};

    const defaults = {
        mode: "balance", 
        personality: "engine", 
        toggles: { ooc: false, control: false },
        aiTags: [], 
        aiGeneratedOptions: [], 
        aiRule: "", 
        addons: [], 
        blocks: [], 
        model: "claude", 
        userNotes: "",
        userLanguage: "", 
        userPronouns: "off"
    };

    if (!extension_settings[extensionName].profiles["default"]) {
        extension_settings[extensionName].profiles["default"] = JSON.parse(JSON.stringify(defaults));
    }

    // Load or Initialize profile
    if (key && extension_settings[extensionName].profiles[key]) {
        localProfile = extension_settings[extensionName].profiles[key];
        $("#ps_rule_status_main").css({"color": "#10b981", "text-shadow": "0 0 10px rgba(16,185,129,0.5)"}).text(`CUSTOM CHARACTER PROFILE`);
    } else {
        localProfile = JSON.parse(JSON.stringify(extension_settings[extensionName].profiles["default"]));
        if(key) $("#ps_rule_status_main").css({"color": "#f59e0b", "text-shadow": "0 0 10px rgba(245,158,11,0.5)"}).text(`USING SYSTEM DEFAULT`);
        else $("#ps_rule_status_main").css({"color": "#a855f7", "text-shadow": "0 0 10px rgba(168,85,247,0.5)"}).text(`MODIFYING GLOBAL DEFAULT`);
    }

    // PATCH: If the saved profile is missing keys (from old version), add them
    Object.keys(defaults).forEach(key => {
        if (localProfile[key] === undefined) localProfile[key] = defaults[key];
    });
    if (!localProfile.toggles) localProfile.toggles = defaults.toggles;

    const context = getContext();
    $("#ps_char_rule_label").text(key && context.characters[context.characterId] ? context.characters[context.characterId].name : "Global Default");
}

function saveProfileToMemory() {
    const key = getCharacterKey() || "default";
    
    // BUG FIX: Only read the text box value if it is currently visible on the screen!
    // This prevents the rule from being wiped when you click toggles in other stages.
    const ruleBox = $("#ps_main_current_rule");
    if (ruleBox.length > 0) {
        localProfile.aiRule = ruleBox.val();
    }
    
    extension_settings[extensionName].profiles[key] = localProfile;
    saveSettingsDebounced();

    // UX POLISH: Flash "Autosaved" text so the customer feels safe
    const saveInd = $("#ps_save_indicator");
    if(saveInd.length) {
        saveInd.html(`<i class="fa-solid fa-check"></i> Saved`).fadeIn(150);
        clearTimeout(window.psSaveTimer);
        window.psSaveTimer = setTimeout(() => saveInd.fadeOut(400), 2000);
    }
}

function updateCharacterDisplay() {
    const context = getContext();
    const pfpElement = $("#ps_char_pfp");
    
    if (context.characterId !== undefined && context.characters[context.characterId]) {
        // If a character is selected, show their SillyTavern portrait
        pfpElement.attr("src", `/characters/${context.characters[context.characterId].avatar}`);
    } else {
        // If in Global Default mode, show your custom Mechanic Megumin image
        // We point to the file saved in your extension folder
        pfpElement.attr("src", `${extensionFolderPath}/img/default.png`);
    }
}

function cleanAIOutput(text) {
    if (!text) return "";
    let cleaned = text;
    const re1 = new RegExp("(<disclaimer>.*?</disclaimer>)|(<guifan>.*?</guifan>)|(<danmu>.*?</danmu>)|(<options>.*?</options>)|```start|```end|<done>|`<done>`|(.*?</ksc?>(\\n)?)|(<ksc?>[\\s\\S]*?</think(ing)?>(\\n)?)", "gs");
    const re2 = new RegExp("(<disclaimer>.*?</disclaimer>)|(<guifan>.*?</guifan>)|(<danmu>.*?</danmu>)|(<options>.*?</options>)|```start|```end|<done>|`<done>`|(.*?</think(ing)?>(\\n)?)|(<think(ing)?>[\\s\\S]*?</think(ing)?>(\\n)?)", "gs");
    return cleaned.replace(re1, "").replace(re2, "").trim();
}

// -------------------------------------------------------------
// UI WIZARD RENDERER
// -------------------------------------------------------------
const stagesUI =[
    { title: "Stage 1: System Mode", sub: "Select the core logic engine.", render: renderMode },
    { title: "Stage 2: Personality", sub: "Define the persona and Extra Toggles.", render: renderPersonality },
    { title: "Stage 3: Writing Style", sub: "Select stylistic tags. AI will compile these into the rule.", render: renderStyle },
    { title: "Stage 4: Add-ons", sub: "Toggle advanced scenario modules.", render: renderAddons },
    { title: "Stage 5: Format Blocks", sub: "Append mechanical blocks to the end of responses.", render: renderBlocks },
    { title: "Stage 6: AI Model Specifics", sub: "Select your LLM for proper Chain of Thought injection.", render: renderModels }
];

function drawWizard(index) {
    currentStage = index;
    const stage = stagesUI[index];
    $("#ps_stage_title").text(stage.title); $("#ps_stage_sub").text(stage.sub);
    $("#ps_breadcrumb_num").text(index + 1); // Updates the Step 1 of 6 text
    
    $(".ps-dot").removeClass("active"); for(let i=0; i<=index; i++) { $(`#dot_${i}`).addClass("active"); }
    const container = $("#ps_stage_content");
    container.empty(); stage.render(container);
    
    $("#ps_btn_prev").toggle(index > 0); 
    $("#ps_btn_next").toggle(index < stagesUI.length - 1);
}

function renderMode(c) {
    // Add temporary descriptions mapped to the IDs
    const descriptions = {
        "balance": "The original Secret Sauce. NPCs react naturally — no simping, no needless hostility. They have their own agenda and act on it.",
        "cinematic": "Hollywood-inspired storytelling. More dramatic beats, cinematic scene transitions, and heightened narrative tension.",
        "dark": "Balance but harsher. The world is unforgiving, NPCs don't sugarcoat, and consequences hit harder."
    };

    const grid = $(`<div class="ps-grid"></div>`);
    hardcodedLogic.modes.forEach(m => {
        const recText = m.recommended ? `<span class="ps-rec-text"><i class="fa-solid fa-star"></i> Recommended</span>` : '';
        const descText = descriptions[m.id] || "";
        const card = $(`<div class="ps-card ${localProfile.mode === m.id ? 'selected' : ''}">
            <div class="ps-card-title"><span>${m.label}</span> ${recText}</div>
            <div class="ps-card-desc">${descText}</div>
        </div>`);
        card.on("click", () => { localProfile.mode = m.id; saveProfileToMemory(); drawWizard(currentStage); });
        grid.append(card);
    }); c.append(grid);
}

function renderPersonality(c) {
    const descriptions = {
        "megumin": "Explosive personality. The system channels chaotic energy and playful narration style.",
        "director": "Professional narrator. Clean, authoritative story direction with cinematic awareness.",
        "engine": "Pure mechanical precision. Maximum control, minimum personality injection. Just clean output."
    };

    c.append(`<div class="ps-rule-title" style="margin-bottom:10px;">Select Persona</div>`);
    const grid = $(`<div class="ps-grid" style="margin-bottom: 25px;"></div>`);
    hardcodedLogic.personalities.forEach(p => {
        const recText = p.recommended ? `<span class="ps-rec-text"><i class="fa-solid fa-star"></i> Recommended</span>` : '';
        const descText = descriptions[p.id] || "";
        const card = $(`<div class="ps-card ${localProfile.personality === p.id ? 'selected' : ''}">
            <div class="ps-card-title"><span>${p.label}</span> ${recText}</div>
            <div class="ps-card-desc">${descText}</div>
        </div>`);
        card.on("click", () => { localProfile.personality = p.id; saveProfileToMemory(); drawWizard(currentStage); });
        grid.append(card);
    }); c.append(grid);
    
    c.append(`<div class="ps-rule-title" style="margin-bottom:10px;">Extra Toggles</div>`);
    Object.entries(hardcodedLogic.toggles).forEach(([key, tog]) => {
        const recText = tog.recommendedOff ? `<span class="ps-rec-text"><i class="fa-solid fa-star"></i> Keep OFF for best results</span>` : '';
        const tCard = $(`<div class="ps-toggle-card ${localProfile.toggles[key] ? 'active' : ''}">
            <div style="display:flex; flex-direction:column;">
                <span style="font-weight:600;">${tog.label}</span>
                <div style="margin-top:4px;">${recText}</div>
            </div>
            <div class="ps-switch"></div></div>`);
        tCard.on("click", () => { localProfile.toggles[key] = !localProfile.toggles[key]; saveProfileToMemory(); drawWizard(currentStage); });
        c.append(tCard);
    });
}

function renderStyle(c) {
    // 1. Hardcoded Categories
    hardcodedLogic.styles.forEach(cat => {
        const wrap = $(`<div class="ps-tag-category"><div class="ps-rule-title" style="margin-bottom: 8px; color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">${cat.category}</div><div style="display: flex; flex-wrap: wrap; gap: 6px;"></div></div>`);
        const tagBox = wrap.find("div").eq(1);
        
        cat.tags.forEach(tagObj => {
            const tagName = tagObj.id;
            const tagHint = tagObj.hint;
            const isSel = localProfile.aiTags.includes(tagName);
            
            // Clean DOM: We just attach the hint as a data-attribute!
            const tEl = $(`<span class="ps-modern-tag ${isSel ? 'selected' : ''}" data-hint="${tagHint}">${tagName}</span>`);
            
            tEl.on("click", () => {
                if(localProfile.aiTags.includes(tagName)) {
                    localProfile.aiTags = localProfile.aiTags.filter(t => t !== tagName);
                } else {
                    localProfile.aiTags.push(tagName);
                }
                saveProfileToMemory(); 
                tEl.toggleClass("selected");
            }); 
            tagBox.append(tEl);
        }); 
        c.append(wrap);
    });

    // 2. Barrier Panel (AI Match + Custom Directives)
    c.append(`
        <div style="margin-top: 32px; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                <div class="ps-rule-title" style="color: var(--text-main); font-size: 0.9rem; font-weight: 700;">
                    <i class="fa-solid fa-sparkles" style="color: var(--gold); margin-right: 6px;"></i> AI Author Matches
                </div>
                <button id="ps_btn_get_authors" class="ps-modern-btn secondary" style="padding: 6px 14px; font-size: 0.75rem;">
                    <i class="fa-solid fa-lightbulb"></i> Generate Insights
                </button>
            </div>
            <div id="ps_ai_author_box" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; min-height: 20px;"></div>
            <hr style="border: 0; border-top: 1px dashed var(--border-color); margin: 0 0 16px 0;" />
            <input type="text" id="ps_stage_notes" class="ps-modern-input" placeholder="Custom Directives..." value="${localProfile.userNotes || ''}" />
        </div>

        <div style="margin-top: 24px; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <span style="font-weight: 600; color: var(--text-main); font-size: 0.95rem;">Final Rule</span>
                <button id="ps_btn_generate" class="ps-modern-btn primary" style="padding: 8px 16px; font-size: 0.8rem; background: var(--text-main); color: #000;"><i class="fa-solid fa-bolt"></i> Generate Writing Rule</button>
            </div>
            <textarea id="ps_main_current_rule" class="ps-modern-input" style="height: 100px; resize: vertical; font-family: monospace; font-size: 0.85rem;" placeholder="Select tags above and click Generate...">${localProfile.aiRule || ''}</textarea>
        </div>
    `);

    // 3. AI Generated Tags Logic
    if (!localProfile.aiGeneratedOptions) localProfile.aiGeneratedOptions = [];
    localProfile.aiGeneratedOptions.forEach(tag => {
        const isSel = localProfile.aiTags.includes(tag);
        const tEl = $(`<span class="ps-modern-tag ${isSel ? 'selected' : ''}">${tag.replace(" ✨", "")} <i class="fa-solid fa-sparkles" style="font-size:0.6rem; margin-left:4px; color:var(--gold);"></i></span>`);
        tEl.on("click", () => {
            if (isSel) localProfile.aiTags = localProfile.aiTags.filter(t => t !== tag);
            else localProfile.aiTags.push(tag);
            saveProfileToMemory(); tEl.toggleClass("selected");
        });
        $("#ps_ai_author_box").append(tEl);
    });

    // 4. Input Listeners
    $("#ps_stage_notes").on("input", function() { localProfile.userNotes = $(this).val(); saveProfileToMemory(); });
    $("#ps_main_current_rule").on("input", function() { localProfile.aiRule = $(this).val(); saveProfileToMemory(); });
}

function renderAddons(c) {
    const descriptions = {
        "death": "Permanent death is on the table. You can actually get a Game Over. No plot armor.",
        "combat": "Lethal, tactical combat. Hits have weight, positioning matters, and fights can go badly fast.",
        "direct": "No euphemisms or flowery evasions. Characters say exactly what they mean.",
        "color": "Each character's dialogue is color-coded for easy visual parsing."
    };

    const grid = $(`<div class="ps-grid"></div>`);
    hardcodedLogic.addons.forEach(a => {
        const isSel = localProfile.addons.includes(a.id);
        const recText = a.recommended ? `<span class="ps-rec-text"><i class="fa-solid fa-star"></i> Recommended</span>` : '';
        const descText = descriptions[a.id] || "";
        const card = $(`<div class="ps-card ${isSel ? 'selected' : ''}">
            <div class="ps-card-title"><span>${a.label}</span> ${recText}</div>
            <div class="ps-card-desc">${descText}</div>
        </div>`);
        card.on("click", () => {
            if(isSel) localProfile.addons = localProfile.addons.filter(i => i !== a.id); else localProfile.addons.push(a.id);
            saveProfileToMemory(); drawWizard(currentStage);
        }); grid.append(card);
    }); c.append(grid);

    // Global Directives Panel logic...
    c.append(`
        <div style="margin-top: 32px; background: var(--bg-panel); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 20px;">
            <div class="ps-rule-title" style="color: var(--text-main); font-size: 0.9rem; font-weight: 700;">
                <i class="fa-solid fa-earth-americas" style="margin-right: 8px; color: #4a90e2;"></i> Extra
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="flex: 1;">
                    <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-main);">Language Output</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Leave empty for default (English)</div>
                </div>
                <input type="text" id="ps_input_language" class="ps-modern-input" style="width: 200px;" placeholder="e.g. Arabic, French..." value="${localProfile.userLanguage || ''}" />
            </div>
            <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 0;" />
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="flex: 1;">
                    <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-main);">User Gender</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">Ensure the AI addresses you correctly</div>
                </div>
                <select id="ps_select_pronouns" class="ps-modern-input" style="width: 200px; cursor: pointer;">
                    <option value="off" ${localProfile.userPronouns === 'off' ? 'selected' : ''}>Off</option>
                    <option value="male" ${localProfile.userPronouns === 'male' ? 'selected' : ''}>Male (Him/He)</option>
                    <option value="female" ${localProfile.userPronouns === 'female' ? 'selected' : ''}>Female (Her/She)</option>
                </select>
            </div>
        </div>
    `);

    $("#ps_input_language").on("input", function() { localProfile.userLanguage = $(this).val(); saveProfileToMemory(); });
    $("#ps_select_pronouns").on("change", function() { localProfile.userPronouns = $(this).val(); saveProfileToMemory(); });
}

function renderBlocks(c) {
    const descriptions = {
        "info": "Appends a clean status block with current weather, time, location, and character clothing.",
        "summary": "A rolling summary the AI updates each response so it never forgets key events or details.",
        "cyoa": "Choose-Your-Own-Adventure panel with 4 suggested actions for you to pick from each turn."
    };

    const grid = $(`<div class="ps-grid"></div>`);
    hardcodedLogic.blocks.forEach(b => {
        const isSel = localProfile.blocks.includes(b.id);
        const recText = b.recommended ? `<span class="ps-rec-text"><i class="fa-solid fa-star"></i> Recommended</span>` : '';
        const descText = descriptions[b.id] || "";
        const card = $(`<div class="ps-card ${isSel ? 'selected' : ''}">
            <div class="ps-card-title"><span>${b.label}</span> ${recText}</div>
            <div class="ps-card-desc">${descText}</div>
        </div>`);
        card.on("click", () => {
            if(isSel) localProfile.blocks = localProfile.blocks.filter(i => i !== b.id); else localProfile.blocks.push(b.id);
            saveProfileToMemory(); drawWizard(currentStage);
        }); grid.append(card);
    }); c.append(grid);
}

function renderModels(c) {
    const descriptions = {
        "gemini": "Standard Gemini model. Chain of Thought optimized for Google's architecture.",
        "gemini-ara": "Gemini variant with enhanced Arabic/multilingual support and tuned CoT.",
        "claude": "Anthropic's Claude. Chain of Thought formatted for Claude's prompting style.",
        "glm": "GLM model support. CoT injection tuned for GLM-series architecture."
    };

    const grid = $(`<div class="ps-grid"></div>`);
    hardcodedLogic.models.forEach(m => {
        const recText = m.recommended ? `<span class="ps-rec-text"><i class="fa-solid fa-star"></i> Recommended</span>` : '';
        const descText = descriptions[m.id] || "";
        const card = $(`<div class="ps-card ${localProfile.model === m.id ? 'selected' : ''}">
            <div class="ps-card-title"><span>${m.label}</span> ${recText}</div>
            <div class="ps-card-desc">${descText}</div>
        </div>`);
        card.on("click", () => { localProfile.model = m.id; saveProfileToMemory(); drawWizard(currentStage); });
        grid.append(card);
    }); c.append(grid);
}

// -------------------------------------------------------------
// AI GENERATION PROCESSES (Targeting [[order]])
// -------------------------------------------------------------
async function useMeguminEngine(task) {
    const selector = $("#settings_preset_openai");
    const option = selector.find(`option`).filter(function() { return $(this).text().trim() === TARGET_PRESET_NAME; });
    let originalValue = null;
    if (option.length) {
        originalValue = selector.val(); selector.val(option.val()).trigger("change");
        await new Promise(r => setTimeout(r, 1000));
    } else { toastr.error(`"${TARGET_PRESET_NAME}" not found in OpenAI presets.`); return; }
    try { await task(); } catch (e) { console.error(`[${extensionName}] AI Error:`, e); }
    finally { selector.val(originalValue).trigger("change"); }
}

// NEW CORE GENERATOR: Triggers an empty prompt so ST processes the preset,
// while we physically inject the true task into [[order]] in the pipeline hook.
async function runMeguminTask(orderText) {
    activeGenerationOrder = orderText;
    try {
        // Send a dummy marker. The hook will delete this dummy marker
        // and inject `activeGenerationOrder` into the [[order]] block.
        return await generateQuietPrompt("___PS_DUMMY___");
    } finally {
        activeGenerationOrder = null;
    }
}

$("body").on("click", "#ps_btn_get_authors", async function() {
    const context = getContext();
    if (context.characterId === undefined) return toastr.warning("Open a chat first!");
    $(this).prop("disabled", true).html(`<i class="fa-solid fa-spinner fa-spin"></i> Brainstorming...`);

    await useMeguminEngine(async () => {
        const orderText = `Based on this character description, give me EXACTLY 2 famous author names or literary writing styles (e.g. Edgar Allan Poe, Jane Austen style, Dark Fantasy Author) and 5 tags that fit the rp (e.g. internet culture, femboy, virtual game) whose writing style perfectly fits the character's tone and world. Return ONLY the 7 items separated by a comma. Do not explain them.`;
        
        let aiRawOutput = await runMeguminTask(orderText);
        aiRawOutput = cleanAIOutput(aiRawOutput);

        const aiTagsTemp = aiRawOutput.split(",").map(t => t.trim().replace(/['"\[\]\.]/g, '')).filter(t => t.length > 0);

        if(aiTagsTemp.length > 0) {
            // 1. Remove previously generated AI tags from your selected list
            localProfile.aiTags = localProfile.aiTags.filter(tag => !tag.endsWith("✨"));
            
            // 2. Set the new items into the generated options list so they appear unselected
            localProfile.aiGeneratedOptions = aiTagsTemp.map(tag => `${tag} ✨`);
            
            saveProfileToMemory(); 
            drawWizard(currentStage); 
            toastr.success(`Generated ${aiTagsTemp.length} insights!`);
        }
    }); 
    $(this).prop("disabled", false).html(`Generate Insights`);
});

$("body").on("click", "#ps_btn_generate", async function() {
    saveProfileToMemory();
    toastr.info("Profile configuration saved!");
    if (localProfile.aiTags.length > 0) {
        $("#ps_btn_generate").prop("disabled", true).html(`<i class="fa-solid fa-spinner fa-spin"></i> Finalizing...`);
        
        await useMeguminEngine(async () => {
            const orderText = `Create a writing style prompt based on these traits:\n\nSelected style tags: ${localProfile.aiTags.join(", ")}\n\nAdditional user instructions: ${localProfile.userNotes}\n\nWrite a concise, well-structured writing style rule (2-4 paragraphs) that the AI must follow. Combine all tags into a cohesive directive. Write it as a direct instruction. Do not use bullet points or introductory text.`;
            
            let rule = await runMeguminTask(orderText);
            rule = cleanAIOutput(rule);

            localProfile.aiRule = rule.trim(); $("#ps_main_current_rule").val(localProfile.aiRule);
            saveProfileToMemory(); toastr.success("Live AI Rule Generated and Applied!");
        }); $("#ps_btn_generate").prop("disabled", false).html(`<i class="fa-solid fa-bolt"></i> Finalize Pipeline`);
    } else {
        toastr.warning("Select tags in Stage 3 first!");
    }
});

$("body").on("input", "#ps_main_current_rule", function() {
    localProfile.aiRule = $(this).val(); saveProfileToMemory();
});

// -------------------------------------------------------------
// LIVE PROMPT INJECTION ENGINE
// -------------------------------------------------------------
function escapeRegex(string) { return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

function handlePromptInjection(data) {
    const messages = data?.messages || data?.chat || (Array.isArray(data) ? data : null);
    if (!messages || !Array.isArray(messages)) return;

    // ---------------------------------------------------------
    // 1. INJECT BACKGROUND GENERATION TASK INTO [[order]]
    // ---------------------------------------------------------
    if (activeGenerationOrder) {
        for (let i = messages.length - 1; i >= 0; i--) {
            if (messages[i].content && typeof messages[i].content === 'string') {
                if (messages[i].content.includes("___PS_DUMMY___")) {
                    messages.splice(i, 1);
                    continue;
                }
                if (messages[i].content.includes("[[order]]")) {
                    messages[i].content = messages[i].content.replace(/\[\[order\]\]/g, activeGenerationOrder);
                    console.log(`[${extensionName}] 🎯 Injected generation task into [[order]]`);
                }
            }
        }
    }

    // ---------------------------------------------------------
    // 2. STANDARD PIPELINE REPLACEMENTS
    // ---------------------------------------------------------
    if (!localProfile) return;

    // INITIALIZE DICT FIRST
    const dict = {};

    // NOW ADD CUSTOM LANGUAGE/PRONOUNS TO DICT
    if (localProfile.userLanguage && localProfile.userLanguage.trim() !== "") {
        dict["[[Language]]"] = `[LANGUAGE RULE]\nALL OUTPUT EXCEPT THINKING MUST BE IN ${localProfile.userLanguage.toUpperCase()} ONLY.`;
    }

    if (localProfile.userPronouns === "male") {
        dict["[[pronouns]]"] = `{{user}} is male. Always portray and address him as such.`;
    } else if (localProfile.userPronouns === "female") {
        dict["[[pronouns]]"] = `{{user}} is female. Always portray and address her as such.`;
    }

    // CONTINUE WITH THE REST OF THE PIPELINE
    const mData = hardcodedLogic.modes.find(m => m.id === localProfile.mode);
    if (mData) {
        dict["[[prompt1]]"] = mData.p1; dict["[[prompt2]]"] = mData.p2;
        dict["[[prompt3]]"] = mData.p3; dict["[[prompt4]]"] = mData.p4;
        dict["[[prompt5]]"] = mData.p5; dict["[[prompt6]]"] = mData.p6;
        
        dict["[prompt1]"] = mData.p1; dict["[prompt2]"] = mData.p2;
        dict["[prompt3]"] = mData.p3; dict["[prompt4]"] = mData.p4;
        dict["[prompt5]"] = mData.p5; dict["[prompt6]"] = mData.p6;

        // Default AI responses mapped to the current mode
        dict["[[AI1]]"] = mData.A1;
        dict["[[AI2]]"] = mData.A2;
    }

    const pData = hardcodedLogic.personalities.find(p => p.id === localProfile.personality);
    if (pData) {
        dict["[[main]]"] = pData.content;
        
        // OVERRIDE: If the user selected the Megumin persona, change the AI acknowledgement!
        if (localProfile.personality === "megumin") {
            dict["[[AI1]]"] = "Fine i read the rules.";
            dict["[[AI2]]"] = "OK i Understnd it.";
        }
    }

    if (localProfile.toggles.ooc) dict["[[OOC]]"] = hardcodedLogic.toggles.ooc.content;
    if (localProfile.toggles.control) dict["[[control]]"] = hardcodedLogic.toggles.control.content;
    if (localProfile.aiRule) dict["[[aiprompt]]"] = localProfile.aiRule;

    localProfile.addons.forEach(aId => { const item = hardcodedLogic.addons.find(a => a.id === aId); if(item) dict[item.trigger] = item.content; });
    localProfile.blocks.forEach(bId => { const item = hardcodedLogic.blocks.find(b => b.id === bId); if(item) dict[item.trigger] = item.content; });
    
    const modData = hardcodedLogic.models.find(m => m.id === localProfile.model);
    if (modData) dict["[[COT]]"] = modData.content;

    let replacementsMade = 0;
    for (const msg of messages) {
        if (msg.content && typeof msg.content === 'string') {
            Object.entries(dict).forEach(([trigger, replacement]) => {
                if (msg.content.includes(trigger)) {
                    const processed = typeof substituteParams === 'function' ? substituteParams(replacement) : replacement;
                    msg.content = msg.content.replace(new RegExp(escapeRegex(trigger), 'g'), processed);
                    replacementsMade++;
                }
            });
            // CLEANUP
            ["[[prompt1]]","[[prompt2]]","[[prompt3]]","[[prompt4]]","[[prompt5]]","[[prompt6]]","[prompt1]","[prompt2]","[prompt3]","[prompt4]","[prompt5]","[prompt6]","[[AI1]]","[[AI2]]","[[main]]","[[OOC]]","[[control]]","[[aiprompt]]","[[death]]","[[combat]]","[[Direct]]","[[COLOR]]","[[infoblock]]","[[summary]]","[[cyoa]]","[[COT]]","[[order]]","[[Language]]","[[pronouns]]"].forEach(tr => {
                if(msg.content.includes(tr)) msg.content = msg.content.replace(new RegExp(escapeRegex(tr), 'g'), "");
            });
        }
    }
    if (replacementsMade > 0 && !activeGenerationOrder) {
        console.log(`[${extensionName}] ✅ Executed ${replacementsMade} hardcoded block replacements.`);
    }
}

$("body").on("click", "#ps_btn_next", function() { if (currentStage < stagesUI.length - 1) drawWizard(currentStage + 1); });
$("body").on("click", "#ps_btn_prev", function() { if (currentStage > 0) drawWizard(currentStage - 1); });

jQuery(async () => {
    try {
        const h = await $.get(`${extensionFolderPath}/example.html`);
        $("body").append(h);
        // CREATE AND TRACK THE FLOATING TOOLTIP
        $("body").append('<div id="ps-global-tooltip"></div>');
        
        $("body").on("mouseenter", ".ps-modern-tag", function() {
            const hint = $(this).attr("data-hint");
            if (!hint) return; // Ignore if it's an AI-generated tag without a hint
            
            const title = $(this).text().trim();
            $("#ps-global-tooltip").html(`<span class="ps-tooltip-title">${title}:</span> ${hint}`).addClass("visible");
        });
        
        $("body").on("mousemove", ".ps-modern-tag", function(e) {
            if (!$(this).attr("data-hint")) return;
            const tooltip = $("#ps-global-tooltip");
            
            // Offset slightly from the mouse cursor
            let x = e.clientX + 15;
            let y = e.clientY + 15;
            
            // Boundary detection: Flip tooltip to the other side if it hits the screen edge!
            if (x + tooltip.outerWidth() > window.innerWidth) {
                x = e.clientX - tooltip.outerWidth() - 15;
            }
            if (y + tooltip.outerHeight() > window.innerHeight) {
                y = e.clientY - tooltip.outerHeight() - 15;
            }
            
            tooltip.css({ left: x + 'px', top: y + 'px' });
        });
        
        $("body").on("mouseleave", ".ps-modern-tag", function() {
            $("#ps-global-tooltip").removeClass("visible");
        });

        // Sidebar Navigation: Click on a stage to jump instantly!
        $("body").on("click", ".sidebar-step", function() {
            const index = parseInt($(this).attr("id").replace("dot_", ""));
            if(!isNaN(index)) drawWizard(index);
        });

        // RESET BUTTON LOGIC (Safety Net)
        $("body").on("click", "#ps_btn_reset", function() {
            if(confirm("Are you sure you want to completely reset this character's profile to the default template?")) {
                const key = getCharacterKey() || "default";
                delete extension_settings[extensionName].profiles[key];
                saveSettingsDebounced();
                initProfile(); drawWizard(0);
                toastr.info("Profile has been reset to defaults.");
            }
        });

        // SAVE & CLOSE BUTTON LOGIC
        $("body").on("click", "#ps_btn_save_close", function() {
            saveProfileToMemory();
            $("#prompt-slot-modal-overlay").fadeOut(200);
            toastr.success("Workflow Configured & Applied Successfully!");
        });

        if (typeof eventSource !== 'undefined' && typeof event_types !== 'undefined') {
            eventSource.on(event_types.CHAT_COMPLETION_PROMPT_READY, handlePromptInjection);
            eventSource.on(event_types.CHAT_CHANGED, () => {
                initProfile(); updateCharacterDisplay();
                if($("#prompt-slot-modal-overlay").is(":visible")) drawWizard(currentStage);
            });
        }

        $("body").on("click", "#prompt-slot-fixed-btn", function() {
            initProfile(); updateCharacterDisplay();
            drawWizard(0); $("#prompt-slot-modal-overlay").fadeIn(250).css("display", "flex");
        });

        $("body").on("click", "#close-prompt-slot-modal, #prompt-slot-modal-overlay", function(e) {
            if (e.target === this) { saveProfileToMemory(); $("#prompt-slot-modal-overlay").fadeOut(200); }
        });
    } catch (e) { console.error(`[${extensionName}] Failed to load:`, e); }
});