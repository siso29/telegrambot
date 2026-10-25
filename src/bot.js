
import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';
import { pool, initializeDatabase } from './db.js';

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('ERROR: BOT_TOKEN is missing from your .env file.');
  process.exit(1);
}

const bot = new Telegraf(token);

// --------------------------------------------------
// 1. LANGUAGE HELPER
// --------------------------------------------------

function L(language, en, am, om) {
  if (language === 'am') return am;
  if (language === 'om') return om;
  return en;
}

const languageNames = {
  en: 'English',
  am: 'አማርኛ',
  om: 'Afaan Oromoo',
};

// --------------------------------------------------
// 2. COURSE AND LESSON DATA
// All lesson content supports English, Amharic,
// and Afaan Oromoo.
// --------------------------------------------------

const courses = {
  g: {
    title: {
      en: 'Graphic Design',
      am: 'ግራፊክ ዲዛይን',
      om: 'Dizaayinii Giraafiksii',
    },
    description: {
      en: 'Learn design basics, colors, and typography.',
      am: 'የዲዛይን መሠረቶችን፣ ቀለሞችን እና የፊደል አጠቃቀምን ይማሩ።',
      om: 'Bu’uura dizaayinii, halluuwwanii fi fayyadama qubee baradhu.',
    },
    lessons: [
      {
        title: {
          en: 'Introduction to Graphic Design',
          am: 'የግራፊክ ዲዛይን መግቢያ',
          om: 'Seensa Dizaayinii Giraafiksii',
        },
        text: {
          en: 'Graphic design communicates ideas through text, colors, images, and layout. It is used to create posters, logos, advertisements, and social media posts.',
          am: 'ግራፊክ ዲዛይን ሐሳቦችን በጽሑፍ፣ በቀለም፣ በምስል እና በአቀማመጥ ለማስተላለፍ ይጠቅማል። ፖስተሮችን፣ ሎጎዎችን፣ ማስታወቂያዎችን እና የማኅበራዊ ሚዲያ ልጥፎችን ለመፍጠር ይጠቅማል።',
          om: 'Dizaayiniin giraafiksii yaada barreeffama, halluu, suuraa fi qindaa’ina fayyadamuun dabarsa. Poostara, mallattoo daldalaa, beeksisa fi ergaa miidiyaa hawaasaa uumuuf ni gargaara.',
        },
        image:
          'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1000',
        video:
          'https://www.youtube.com/results?search_query=graphic+design+basics+for+beginners',
        question: {
          en: 'What is the main purpose of graphic design?',
          am: 'የግራፊክ ዲዛይን ዋና ዓላማ ምንድን ነው?',
          om: 'Kaayyoon guddaan dizaayinii giraafiksii maali?',
        },
        options: [
          {
            en: 'To communicate ideas visually',
            am: 'ሐሳቦችን በምስል ለማስተላለፍ',
            om: 'Yaada karaa mul’atuun dabarsuuf',
          },
          {
            en: 'To repair computers',
            am: 'ኮምፒውተሮችን ለመጠገን',
            om: 'Kompiitara suphuuf',
          },
          {
            en: 'To cook food',
            am: 'ምግብ ለማብሰል',
            om: 'Nyaata bilcheessuuf',
          },
        ],
        correct: 0,
      },
      {
        title: {
          en: 'Color Theory',
          am: 'የቀለም ቲዎሪ',
          om: 'Yaad-rimee Halluu',
        },
        text: {
          en: 'Color theory helps designers choose colors that work well together. Primary colors are red, yellow, and blue in the traditional art color model. Color combinations can create contrast, mood, and visual balance.',
          am: 'የቀለም ቲዎሪ ዲዛይነሮች እርስ በርሳቸው የሚስማሙ ቀለሞችን እንዲመርጡ ይረዳል። በባህላዊው የሥዕል ቀለም ሞዴል ዋና ቀለሞች ቀይ፣ ቢጫ እና ሰማያዊ ናቸው። ቀለሞች ንፅፅርን፣ ስሜትን እና ሚዛናዊ አቀማመጥን ይፈጥራሉ።',
          om: 'Yaad-rimeen halluu dizaayinaroonni halluuwwan walitti tolan akka filatan gargaara. Moodeela aartii halluu aadaa keessatti halluuwwan bu’uuraa diimaa, keelloo fi cuquliisa dha. Walitti makamuun halluuwwanii garaagarummaa, miira fi madaallii mul’ataa uuma.',
        },
        image:
          'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1000',
        video:
          'https://www.youtube.com/results?search_query=color+theory+for+graphic+design+beginners',
        question: {
          en: 'Why is color theory useful?',
          am: 'የቀለም ቲዎሪ ለምን ይጠቅማል?',
          om: 'Yaad-rimeen halluu maaliif barbaachisaa dha?',
        },
        options: [
          {
            en: 'It helps choose suitable color combinations',
            am: 'ተስማሚ የቀለም ጥምረት ለመምረጥ ይረዳል',
            om: 'Walitti makama halluu mijataa filachuuf gargaara',
          },
          {
            en: 'It increases computer storage',
            am: 'የኮምፒውተር ማከማቻን ይጨምራል',
            om: 'Kuusaa kompiitaraa dabala',
          },
          {
            en: 'It repairs a keyboard',
            am: 'ኪቦርድን ይጠግናል',
            om: 'Kiiboordii supha',
          },
        ],
        correct: 0,
      },
      {
        title: {
          en: 'Typography and Fonts',
          am: 'የፊደል ቅርጽ እና አጠቃቀም',
          om: 'Bifa Qubee fi Fayyadama Isaa',
        },
        text: {
          en: 'Typography is the art of arranging text so it is clear and attractive. Choose readable fonts, use suitable text sizes, and create a clear difference between headings and body text.',
          am: 'የፊደል አጠቃቀም ጽሑፍን ግልጽና ማራኪ በሆነ መንገድ የማደራጀት ጥበብ ነው። በቀላሉ የሚነበቡ የፊደል ቅርጾችን ይምረጡ፣ ተስማሚ የጽሑፍ መጠን ይጠቀሙ፣ በርዕስና በዋና ጽሑፍ መካከልም ልዩነት ይፍጠሩ።',
          om: 'Fayyadamni qubee ogummaa barreeffama ifaa fi hawwataa ta’een qindeessuu dha. Qubee salphaatti dubbifamu filadhu, guddina barreeffamaa mijataa fayyadami, mata-duree fi barreeffama ijoo gidduutti garaagarummaa uumi.',
        },
        image:
          'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000',
        video:
          'https://www.youtube.com/results?search_query=typography+basics+for+beginners',
        question: {
          en: 'What makes typography effective?',
          am: 'የፊደል አጠቃቀምን ውጤታማ የሚያደርገው ምንድን ነው?',
          om: 'Fayyadama qubee bu’a qabeessa kan taasisu maali?',
        },
        options: [
          {
            en: 'Readable fonts and clear text hierarchy',
            am: 'በቀላሉ የሚነበቡ ፊደሎችና ግልጽ የጽሑፍ ደረጃ',
            om: 'Qubee dubbifamuu danda’u fi tartiiba barreeffamaa ifa ta’e',
          },
          {
            en: 'Making every word extremely small',
            am: 'ሁሉንም ቃላት በጣም ትንሽ ማድረግ',
            om: 'Jechoota hunda baay’ee xixiqqoo gochuu',
          },
          {
            en: 'Using as many fonts as possible',
            am: 'በተቻለ መጠን ብዙ የፊደል ቅርጾችን መጠቀም',
            om: 'Qubee adda addaa baay’ee fayyadamuu',
          },
        ],
        correct: 0,
      },
    ],
  },

  v: {
    title: {
      en: 'Video Editing',
      am: 'ቪዲዮ ኤዲቲንግ',
      om: 'Gulaallii Viidiyoo',
    },
    description: {
      en: 'Learn video basics, trimming, text, and audio.',
      am: 'የቪዲዮ መሠረቶችን፣ መቁረጥን፣ ጽሑፍን እና ድምፅን ይማሩ።',
      om: 'Bu’uura viidiyoo, kutuu, barreeffama fi sagalee baradhu.',
    },
    lessons: [
      {
        title: {
          en: 'Introduction to Video Editing',
          am: 'የቪዲዮ ኤዲቲንግ መግቢያ',
          om: 'Seensa Gulaallii Viidiyoo',
        },
        text: {
          en: 'Video editing means arranging video clips, images, text, and sound into a complete video. You can use editing tools to tell a story, explain a lesson, or create content for social media.',
          am: 'ቪዲዮ ኤዲቲንግ የቪዲዮ ክፍሎችን፣ ምስሎችን፣ ጽሑፍን እና ድምፅን አደራጅቶ ሙሉ ቪዲዮ የመፍጠር ሂደት ነው። ታሪክ ለመናገር፣ ትምህርት ለማብራራት ወይም ለማኅበራዊ ሚዲያ ይዘት ለመፍጠር ይጠቅማል።',
          om: 'Gulaalliin viidiyoo kutaa viidiyoo, suuraa, barreeffama fi sagalee walitti qindeessuun viidiyoo guutuu uumuudha. Seenaa himuuf, barnoota ibsuuf ykn qabiyyee miidiyaa hawaasaaf uumuuf ni gargaara.',
        },
        image:
          'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000',
        video:
          'https://www.youtube.com/results?search_query=video+editing+for+beginners',
        question: {
          en: 'What is video editing?',
          am: 'ቪዲዮ ኤዲቲንግ ምንድን ነው?',
          om: 'Gulaalliin viidiyoo maali?',
        },
        options: [
          {
            en: 'Arranging clips, images, text, and sound into a video',
            am: 'የቪዲዮ ክፍሎችን፣ ምስሎችን፣ ጽሑፍንና ድምፅን አደራጅቶ ቪዲዮ መፍጠር',
            om: 'Kutaa viidiyoo, suuraa, barreeffama fi sagalee qindeessuun viidiyoo uumu',
          },
          {
            en: 'Cleaning a computer screen',
            am: 'የኮምፒውተር ስክሪን ማጽዳት',
            om: 'Iskiriinii kompiitaraa qulqulleessuu',
          },
          {
            en: 'Installing a printer',
            am: 'ፕሪንተር መጫን',
            om: 'Piriintara dhaabuu',
          },
        ],
        correct: 0,
      },
      {
        title: {
          en: 'Cutting and Trimming Clips',
          am: 'የቪዲዮ ክፍሎችን መቁረጥ',
          om: 'Kutaa Viidiyoo Kutuu fi Gabaabessuu',
        },
        text: {
          en: 'Cutting removes unwanted parts of a clip. Trimming adjusts the beginning or end of a clip. These tools help remove mistakes, reduce unnecessary pauses, and improve the flow of a video.',
          am: 'መቁረጥ በቪዲዮ ውስጥ የማያስፈልጉ ክፍሎችን ያስወግዳል። Trimming ደግሞ የቪዲዮን መጀመሪያ ወይም መጨረሻ ያስተካክላል። እነዚህ መሣሪያዎች ስህተቶችንና አላስፈላጊ እረፍቶችን ለማስወገድ ይረዳሉ።',
          om: 'Kutuun kutaa viidiyoo hin barbaachifne balleessa. Trimming immoo jalqaba ykn dhuma kutaa viidiyoo sirreessa. Meeshaaleen kun dogoggora fi dhaabbii hin barbaachifne balleessuun viidiyoon akka sirriitti yaa’u gargaara.',
        },
        image:
          'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1000',
        video:
          'https://www.youtube.com/results?search_query=how+to+cut+and+trim+video+clips',
        question: {
          en: 'Why do editors trim video clips?',
          am: 'የቪዲዮ አርታዒዎች ለምን ቪዲዮን ይቆርጣሉ?',
          om: 'Gulaaltoonni viidiyoo maaliif kutaa viidiyoo gabaabsu?',
        },
        options: [
          {
            en: 'To remove unwanted parts and improve flow',
            am: 'የማያስፈልጉ ክፍሎችን ለማስወገድና የቪዲዮን ፍሰት ለማሻሻል',
            om: 'Kutaa hin barbaachifne balleessuu fi yaa’a viidiyoo fooyyessuuf',
          },
          {
            en: 'To make the screen brighter only',
            am: 'ስክሪኑን ብሩህ ለማድረግ ብቻ',
            om: 'Iskiriinii qofa ifa gochuuf',
          },
          {
            en: 'To change the computer password',
            am: 'የኮምፒውተር የይለፍ ቃል ለመቀየር',
            om: 'Jecha iccitii kompiitaraa jijjiiruuf',
          },
        ],
        correct: 0,
      },
      {
        title: {
          en: 'Text and Audio',
          am: 'ጽሑፍ እና ድምፅ',
          om: 'Barreeffama fi Sagalee',
        },
        text: {
          en: 'Text can provide titles, subtitles, and explanations. Audio can include narration, music, and sound effects. Keep text readable and balance the audio so speech can be heard clearly.',
          am: 'ጽሑፍ ርዕሶችን፣ ንዑስ ርዕሶችን እና ማብራሪያዎችን ለማሳየት ይጠቅማል። ድምፅ ትረካን፣ ሙዚቃን እና የድምፅ ውጤቶችን ሊያካትት ይችላል። ጽሑፉ በቀላሉ እንዲነበብ ያድርጉ፣ የሰው ንግግርም በግልጽ እንዲሰማ ድምፁን ያስተካክሉ።',
          om: 'Barreeffamni mata-duree, mata-duree xiqqaa fi ibsa agarsiisuuf gargaara. Sagaleen dubbisa, muuziqaa fi sagalee dabalataa of keessatti qabachuu danda’a. Barreeffamni salphaatti akka dubbifamu godhi; sagalees haala dubbii ifatti dhaga’amuun madaali.',
        },
        image:
          'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1000',
        video:
          'https://www.youtube.com/results?search_query=how+to+add+text+and+audio+to+videos',
        question: {
          en: 'What should you do to make speech clear in a video?',
          am: 'በቪዲዮ ውስጥ ንግግር በግልጽ እንዲሰማ ምን ማድረግ አለብዎት?',
          om: 'Dubbii viidiyoo keessatti ifatti dhageessisuuf maal gochuu qabda?',
        },
        options: [
          {
            en: 'Balance the audio levels',
            am: 'የድምፅ መጠኖችን ማስተካከል',
            om: 'Sadarkaa sagalee madaaluu',
          },
          {
            en: 'Mute every audio track',
            am: 'ሁሉንም የድምፅ ክፍሎች ዝም ማድረግ',
            om: 'Sagalee hunda cufuu',
          },
          {
            en: 'Make all text unreadable',
            am: 'ሁሉንም ጽሑፍ የማይነበብ ማድረግ',
            om: 'Barreeffama hunda kan hin dubbifamne gochuu',
          },
        ],
        correct: 0,
      },
    ],
  },
};

// --------------------------------------------------
// 3. LEARNER DATA
// PostgreSQL stores learner preferences, enrollments,
// completed lessons, and quiz attempts.
// --------------------------------------------------

const learners = new Map();

function getLearner(userId) {
  if (!learners.has(userId)) {
    learners.set(userId, {
      language: 'en',
      enrolled: new Set(),
      progress: { g: 0, v: 0 },
      completed: {
        g: new Set(),
        v: new Set(),
      },
    });
  }

  return learners.get(userId);
}

async function loadLearnerFromDatabase(userId) {
  await pool.query(
    `INSERT INTO learners (telegram_id)
     VALUES ($1)
     ON CONFLICT (telegram_id) DO NOTHING`,
    [userId],
  );

  const savedLearner = await pool.query(
    'SELECT language FROM learners WHERE telegram_id = $1',
    [userId],
  );

  const learner = getLearner(userId);
  learner.language = savedLearner.rows[0]?.language ?? 'en';

  const enrollmentResult = await pool.query(
    'SELECT course_key FROM enrollments WHERE telegram_id = $1',
    [userId],
  );

  learner.enrolled = new Set(
    enrollmentResult.rows.map((row) => row.course_key),
  );

  const progressResult = await pool.query(
    `SELECT course_key, lesson_index
     FROM lesson_progress
     WHERE telegram_id = $1`,
    [userId],
  );

  learner.completed = { g: new Set(), v: new Set() };
  learner.progress = { g: 0, v: 0 };

  for (const row of progressResult.rows) {
    const courseKey = row.course_key;
    const lessonIndex = Number(row.lesson_index);

    if (learner.completed[courseKey]) {
      learner.completed[courseKey].add(lessonIndex);
      learner.progress[courseKey] = Math.max(
        learner.progress[courseKey],
        lessonIndex + 1,
      );
    }
  }

  return learner;
}

function courseTitle(courseKey, language) {
  return courses[courseKey].title[language];
}

// --------------------------------------------------
// 4. LANGUAGE SELECTION
// --------------------------------------------------

async function showLanguageMenu(ctx) {
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback('🇬🇧 English', 'lang_en')],
    [Markup.button.callback('🇪🇹 አማርኛ', 'lang_am')],
    [Markup.button.callback('🌍 Afaan Oromoo', 'lang_om')],
  ]);

  await ctx.reply(
    'Welcome to Telegram Skills Academy!\n' +
      'ወደ ቴሌግራም ክህሎት አካዳሚ እንኳን በደህና መጡ!\n' +
      'Baga gara Telegram Skills Academy dhuftan!\n\n' +
      'Please choose your language / ቋንቋ ይምረጡ / Afaan filadhu:',
    keyboard,
  );
}

bot.start(async (ctx) => {
  await loadLearnerFromDatabase(String(ctx.from.id));
  await showLanguageMenu(ctx);
});

bot.action(/^lang_(en|am|om)$/, async (ctx) => {
  await ctx.answerCbQuery();

  const language = ctx.match[1];
  const learner = await loadLearnerFromDatabase(String(ctx.from.id));

  learner.language = language;

  await pool.query(
    'UPDATE learners SET language = $1 WHERE telegram_id = $2',
    [language, String(ctx.from.id)],
  );

  await ctx.reply(
    L(
      language,
      'Your language is set to English. Welcome!',
      'ቋንቋዎ አማርኛ ሆኖ ተቀናብሯል። እንኳን በደህና መጡ!',
      'Afaan kee Afaan Oromoo ta’ee qindaa’eera. Baga nagaan dhuftan!',
    ),
  );

  await showMenu(ctx);
});

// --------------------------------------------------
// 5. MAIN MENU
// --------------------------------------------------

async function showMenu(ctx) {
  const learner = await loadLearnerFromDatabase(String(ctx.from.id));
  const language = learner.language;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        `🎨 ${courseTitle('g', language)}`,
        'course_g',
      ),
    ],
    [
      Markup.button.callback(
        `🎬 ${courseTitle('v', language)}`,
        'course_v',
      ),
    ],
    [
      Markup.button.callback(
        L(language, '📊 My Progress', '📊 እድገቴ', '📊 Guddina Koo'),
        'my_progress',
      ),
    ],
    [
      Markup.button.callback(
        L(
          language,
          '🌐 Change Language',
          '🌐 ቋንቋ ቀይር',
          '🌐 Afaan Jijjiiri',
        ),
        'change_language',
      ),
    ],
  ]);

  await ctx.reply(
    L(
      language,
      '🎓 TELEGRAM SKILLS ACADEMY\n\nChoose a course to begin learning.',
      '🎓 የቴሌግራም ክህሎት አካዳሚ\n\nለመማር ኮርስ ይምረጡ።',
      '🎓 TELEGRAM SKILLS ACADEMY\n\nBarachuu jalqabuuf koorsii filadhu.',
    ),
    keyboard,
  );
}

bot.action('change_language', async (ctx) => {
  await ctx.answerCbQuery();
  await showLanguageMenu(ctx);
});

// --------------------------------------------------
// 6. SHOW AVAILABLE COURSES
// --------------------------------------------------

bot.command('courses', async (ctx) => {
  await showMenu(ctx);
});

bot.action(/^course_([gv])$/, async (ctx) => {
  await ctx.answerCbQuery();
  await showCourse(ctx, ctx.match[1]);
});

async function showCourse(ctx, courseKey) {
  const learner = await loadLearnerFromDatabase(String(ctx.from.id));
  const language = learner.language;
  const course = courses[courseKey];

  const currentProgress = learner.progress[courseKey];
  const totalLessons = course.lessons.length;
  const isEnrolled = learner.enrolled.has(courseKey);
  const isComplete = currentProgress >= totalLessons;

  const keyboard = [];

  if (!isEnrolled) {
    keyboard.push([
      Markup.button.callback(
        L(language, '✅ Enroll', '✅ ተመዝገብ', '✅ Galmaa’i'),
        `enroll_${courseKey}`,
      ),
    ]);
  } else if (!isComplete) {
    keyboard.push([
      Markup.button.callback(
        L(
          language,
          '▶️ Continue Learning',
          '▶️ ትምህርቱን ቀጥል',
          '▶️ Barachuu Itti Fufi',
        ),
        `continue_${courseKey}`,
      ),
    ]);
  } else {
    keyboard.push([
      Markup.button.callback(
        L(
          language,
          '🔁 Review Lessons',
          '🔁 ትምህርቶችን እንደገና ተመልከት',
          '🔁 Barnoota Irra Deebi’i',
        ),
        `continue_${courseKey}`,
      ),
    ]);
  }

  keyboard.push([
    Markup.button.callback(
      L(language, '⬅️ Main Menu', '⬅️ ዋና ምናሌ', '⬅️ Baafata Ijoo'),
      'main_menu',
    ),
  ]);

  await ctx.reply(
    `📚 ${course.title[language]}\n\n` +
      `${course.description[language]}\n\n` +
      L(
        language,
        `Lessons: ${totalLessons}\nCompleted: ${Math.min(currentProgress, totalLessons)} of ${totalLessons}`,
        `ትምህርቶች፦ ${totalLessons}\nየተጠናቀቁ፦ ${Math.min(currentProgress, totalLessons)} ከ ${totalLessons}`,
        `Barnoota: ${totalLessons}\nKan xumuraman: ${Math.min(currentProgress, totalLessons)} keessaa ${totalLessons}`,
      ),
    Markup.inlineKeyboard(keyboard),
  );
}

bot.action('main_menu', async (ctx) => {
  await ctx.answerCbQuery();
  await showMenu(ctx);
});

// --------------------------------------------------
// 7. ENROLLMENT
// --------------------------------------------------

bot.action(/^enroll_([gv])$/, async (ctx) => {
  await ctx.answerCbQuery();

  const courseKey = ctx.match[1];
  const learner = await loadLearnerFromDatabase(String(ctx.from.id));
  const language = learner.language;

  learner.enrolled.add(courseKey);

  await pool.query(
    `INSERT INTO enrollments (telegram_id, course_key)
     VALUES ($1, $2)
     ON CONFLICT (telegram_id, course_key) DO NOTHING`,
    [String(ctx.from.id), courseKey],
  );

  await ctx.reply(
    L(
      language,
      `You enrolled in ${courseTitle(courseKey, language)} successfully!`,
      `${courseTitle(courseKey, language)} ኮርስ በተሳካ ሁኔታ ተመዝግበዋል!`,
      `${courseTitle(courseKey, language)} keessatti milkaa’inaan galmoofteetta!`,
    ),
  );

  await sendLesson(ctx, courseKey, learner.progress[courseKey]);
});

bot.action(/^continue_([gv])$/, async (ctx) => {
  await ctx.answerCbQuery();

  const courseKey = ctx.match[1];
  const learner = await loadLearnerFromDatabase(String(ctx.from.id));

  learner.enrolled.add(courseKey);

  await pool.query(
    `INSERT INTO enrollments (telegram_id, course_key)
     VALUES ($1, $2)
     ON CONFLICT (telegram_id, course_key) DO NOTHING`,
    [String(ctx.from.id), courseKey],
  );

  let lessonIndex = learner.progress[courseKey];

  // If the course is complete, allow learners to review it.
  if (lessonIndex >= courses[courseKey].lessons.length) {
    lessonIndex = 0;
  }

  await sendLesson(ctx, courseKey, lessonIndex);
});

// --------------------------------------------------
// 8. SEND A LESSON
// --------------------------------------------------

async function sendLesson(ctx, courseKey, lessonIndex) {
  const learner = await loadLearnerFromDatabase(String(ctx.from.id));
  const language = learner.language;
  const course = courses[courseKey];

  if (lessonIndex >= course.lessons.length) {
    await ctx.reply(
      L(
        language,
        `🎉 Congratulations! You completed ${course.title[language]}!`,
        `🎉 እንኳን ደስ አልዎት! ${course.title[language]} ኮርስን ጨርሰዋል!`,
        `🎉 Baga gammaddan! ${course.title[language]} xumurtee jirta!`,
      ),
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            L(language, '📊 My Progress', '📊 እድገቴ', '📊 Guddina Koo'),
            'my_progress',
          ),
        ],
        [
          Markup.button.callback(
            L(language, '🏠 Main Menu', '🏠 ዋና ምናሌ', '🏠 Baafata Ijoo'),
            'main_menu',
          ),
        ],
      ]),
    );
    return;
  }

  const lesson = course.lessons[lessonIndex];

  const caption =
    `📘 ${course.title[language]}\n` +
    `${L(language, 'Lesson', 'ትምህርት', 'Barnoota')} ${lessonIndex + 1}/${course.lessons.length}\n\n` +
    `📝 ${lesson.title[language]}\n\n` +
    lesson.text[language];

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        L(language, '📝 Take Quiz', '📝 ፈተና ውሰድ', '📝 Qormaata Fudhadhu'),
        `quiz_${courseKey}_${lessonIndex}`,
      ),
    ],
    [
      Markup.button.url(
        L(language, '▶️ Watch Video', '▶️ ቪዲዮ ተመልከት', '▶️ Viidiyoo Ilaali'),
        lesson.video,
      ),
    ],
    [
      Markup.button.callback(
        L(language, '⬅️ Course Menu', '⬅️ ወደ ኮርስ', '⬅️ Gara Koorsii'),
        `course_${courseKey}`,
      ),
    ],
  ]);

  try {
    await ctx.replyWithPhoto(lesson.image, {
      caption,
      reply_markup: keyboard.reply_markup,
    });
  } catch (error) {
    console.error('Could not send lesson image:', error.message);

    await ctx.reply(caption, keyboard);
  }
}

// --------------------------------------------------
// 9. QUIZ
// --------------------------------------------------

bot.action(/^quiz_([gv])_(\d+)$/, async (ctx) => {
  await ctx.answerCbQuery();

  const courseKey = ctx.match[1];
  const lessonIndex = Number(ctx.match[2]);

  const learner = await loadLearnerFromDatabase(String(ctx.from.id));
  const language = learner.language;
  const lesson = courses[courseKey].lessons[lessonIndex];

  if (!lesson) {
    await ctx.reply(
      L(language, 'Lesson not found.', 'ትምህርቱ አልተገኘም።', 'Barnoonni hin argamne.'),
    );
    return;
  }

  const buttons = lesson.options.map((option, optionIndex) => [
    Markup.button.callback(
      option[language],
      `answer_${courseKey}_${lessonIndex}_${optionIndex}`,
    ),
  ]);

  buttons.push([
    Markup.button.callback(
      L(language, '⬅️ Back to Lesson', '⬅️ ወደ ትምህርት', '⬅️ Gara Barnootaa'),
      `back_${courseKey}_${lessonIndex}`,
    ),
  ]);

  await ctx.reply(
    `📝 ${lesson.title[language]}\n\n${lesson.question[language]}`,
    Markup.inlineKeyboard(buttons),
  );
});

bot.action(/^back_([gv])_(\d+)$/, async (ctx) => {
  await ctx.answerCbQuery();
  await sendLesson(ctx, ctx.match[1], Number(ctx.match[2]));
});

bot.action(/^answer_([gv])_(\d+)_(\d+)$/, async (ctx) => {
  await ctx.answerCbQuery();

  const courseKey = ctx.match[1];
  const lessonIndex = Number(ctx.match[2]);
  const answerIndex = Number(ctx.match[3]);

  const learner = await loadLearnerFromDatabase(String(ctx.from.id));
  const language = learner.language;
  const course = courses[courseKey];
  const lesson = course.lessons[lessonIndex];

  if (!lesson || !lesson.options[answerIndex]) {
    await ctx.reply(
      L(language, 'Invalid answer.', 'የተሳሳተ ምርጫ ነው።', 'Deebiin kun sirrii miti.'),
    );
    return;
  }

  await pool.query(
    `INSERT INTO quiz_attempts
       (telegram_id, course_key, lesson_index, selected_answer, is_correct)
     VALUES ($1, $2, $3, $4, $5)`,
    [
      String(ctx.from.id),
      courseKey,
      lessonIndex,
      answerIndex,
      answerIndex === lesson.correct,
    ],
  );

  if (answerIndex === lesson.correct) {
    learner.completed[courseKey].add(lessonIndex);

    await pool.query(
      `INSERT INTO lesson_progress (telegram_id, course_key, lesson_index)
       VALUES ($1, $2, $3)
       ON CONFLICT (telegram_id, course_key, lesson_index) DO NOTHING`,
      [String(ctx.from.id), courseKey, lessonIndex],
    );

    learner.progress[courseKey] = Math.max(
      learner.progress[courseKey],
      lessonIndex + 1,
    );

    await ctx.reply(
      L(
        language,
        '✅ Correct answer! Well done!',
        '✅ ትክክለኛ መልስ! በጣም ጥሩ!',
        '✅ Deebii sirrii! Baay’ee gaariidha!',
      ),
    );

    await sendLesson(ctx, courseKey, learner.progress[courseKey]);
  } else {
    await ctx.reply(
      L(
        language,
        '❌ Not quite right. Review the lesson and try again.',
        '❌ ትክክለኛ መልስ አይደለም። ትምህርቱን እንደገና ይመልከቱና ይሞክሩ።',
        '❌ Deebiin sirrii miti. Barnoota irra deebi’ii ilaali; achiis yaali.',
      ),
      Markup.inlineKeyboard([
        [
          Markup.button.callback(
            L(language, '🔁 Try Again', '🔁 እንደገና ሞክር', '🔁 Irra Deebi’ii Yaali'),
            `quiz_${courseKey}_${lessonIndex}`,
          ),
        ],
        [
          Markup.button.callback(
            L(language, '📘 Review Lesson', '📘 ትምህርቱን ተመልከት', '📘 Barnoota Ilaali'),
            `back_${courseKey}_${lessonIndex}`,
          ),
        ],
      ]),
    );
  }
});

// --------------------------------------------------
// 10. LEARNER PROGRESS
// --------------------------------------------------

bot.action('my_progress', async (ctx) => {
  await ctx.answerCbQuery();

  const learner = await loadLearnerFromDatabase(String(ctx.from.id));
  const language = learner.language;

  const lines = [
    L(language, '📊 YOUR LEARNING PROGRESS', '📊 የመማር እድገትዎ', '📊 GUDDINA BARNOOTAA KEE'),
    '',
  ];

  for (const courseKey of Object.keys(courses)) {
    const course = courses[courseKey];
    const completed = Math.min(
      learner.progress[courseKey],
      course.lessons.length,
    );

    const status = learner.enrolled.has(courseKey)
      ? L(language, 'Enrolled', 'ተመዝግበዋል', 'Galmaa’eera')
      : L(language, 'Not enrolled', 'አልተመዘገቡም', 'Hin galmoofne');

    lines.push(
      `${course.title[language]}`,
      `${L(language, 'Status', 'ሁኔታ', 'Haala')}: ${status}`,
      `${L(language, 'Lessons completed', 'የተጠናቀቁ ትምህርቶች', 'Barnoota xumurame')}: ${completed}/${course.lessons.length}`,
      '',
    );
  }

  await ctx.reply(
    lines.join('\n'),
    Markup.inlineKeyboard([
      [
        Markup.button.callback(
          L(language, '🏠 Main Menu', '🏠 ዋና ምናሌ', '🏠 Baafata Ijoo'),
          'main_menu',
        ),
      ],
    ]),
  );
});

// --------------------------------------------------
// 11. HELP COMMAND
// --------------------------------------------------

bot.command('help', async (ctx) => {
  const learner = await loadLearnerFromDatabase(String(ctx.from.id));
  const language = learner.language;

  await ctx.reply(
    L(
      language,
      '📖 HELP\n\n/start - Start the bot and choose a language\n/courses - View courses\n/help - Show this help message\n\nChoose a course, enroll, read a lesson, and take its quiz.',
      '📖 እገዛ\n\n/start - ቦቱን ለመጀመርና ቋንቋ ለመምረጥ\n/courses - ኮርሶችን ለማየት\n/help - ይህን የእገዛ መልዕክት ለማየት\n\nኮርስ ይምረጡ፣ ይመዝገቡ፣ ትምህርት ያንብቡና ፈተና ይውሰዱ።',
      '📖 GARGAARSA\n\n/start - Botii jalqabuuf fi afaan filachuuf\n/courses - Koorsii ilaaluuf\n/help - Ergaa gargaarsaa kana ilaaluuf\n\nKoorsii filadhu, galmaa’i, barnoota dubbisi, achiis qormaata fudhadhu.',
    ),
  );
});

// --------------------------------------------------
// 12. START THE BOT
// --------------------------------------------------

bot.catch((error, ctx) => {
  console.error(`Bot error for update ${ctx.update.update_id}:`, error);
});

async function startBot() {
  try {
    await initializeDatabase();
    console.log('Database tables are ready.');

    await bot.launch();

    console.log('Telegram Skills Academy bot is running!');
    console.log('Supported languages: English, Amharic, Afaan Oromoo');
  } catch (error) {
    console.error('Could not start the bot:', error.message);
    await pool.end().catch(() => {});
    process.exit(1);
  }
}

async function shutdown(signal) {
  bot.stop(signal);

  try {
    await pool.end();
  } catch (error) {
    console.error('Error closing database connection:', error.message);
  }
}

startBot();

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
