/**
 * Curated high-resolution image mapper and formatter for Google Blogger posts
 */

interface TopicImageMap {
  [key: string]: string;
}

const TOPIC_IMAGES: TopicImageMap = {
  // Sindh Board & Education
  'sindh_board_physics': 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&w=1200&q=80',
  'sindh_board_chemistry': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
  'sindh_board_biology': 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1200&q=80',
  'sindh_board_math': 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
  'sindh_board_computer': 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
  'sindh_board_english': 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1200&q=80',
  'sindh_board_urdu': 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
  'sindh_board_pak_studies': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
  'sindh_board_islamiat': 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
  'sindh_board_commerce': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  'sindh_board_general': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
  'sindh_board_primary': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80',
  
  // Health & Wellness
  'health_habits': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
  'health_immunity': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
  'health_nutrition': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
  'health_sleep': 'https://images.unsplash.com/photo-1511295742362-92c96b124e52?auto=format&fit=crop&w=1200&q=80',
  'health_mental': 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  'health_fatigue': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
  'health_gut': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',

  // Tech & Coding
  'tech_coding': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
  'tech_ai': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
  'tech_cloud': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'tech_react': 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1200&q=80',

  // News & Media (Dawn, The News, Aaj News, Sindhi Channels, Arabic, National)
  'news_general': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
  'news_dawn': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
  'news_broadcast': 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80',
  'news_sindh': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
  'news_economy': 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
  'news_arabic': 'https://images.unsplash.com/photo-1512632570417-a6032a757277?auto=format&fit=crop&w=1200&q=80',
};

/**
 * Get an appropriate high-resolution image URL based on category, subject, and angle
 */
export function getFeaturedImageUrl(
  category: string,
  angle: string,
  sindhSubject?: string
): string {
  const lowerAngle = (angle || '').toLowerCase();
  const lowerSub = (sindhSubject || '').toLowerCase();

  if (category === 'news') {
    if (lowerAngle.includes('sindh') || lowerAngle.includes('ktn') || lowerAngle.includes('kawish') || lowerAngle.includes('awami') || lowerAngle.includes('سنڌ')) {
      return TOPIC_IMAGES['news_sindh'];
    }
    if (lowerAngle.includes('dawn') || lowerAngle.includes('the news') || lowerAngle.includes('newspaper')) {
      return TOPIC_IMAGES['news_dawn'];
    }
    if (lowerAngle.includes('aaj') || lowerAngle.includes('geo') || lowerAngle.includes('ary') || lowerAngle.includes('tv') || lowerAngle.includes('channel')) {
      return TOPIC_IMAGES['news_broadcast'];
    }
    if (lowerAngle.includes('arabic') || lowerAngle.includes('الجزيرة') || lowerAngle.includes('العربية')) {
      return TOPIC_IMAGES['news_arabic'];
    }
    if (lowerAngle.includes('economy') || lowerAngle.includes('budget') || lowerAngle.includes('rupee') || lowerAngle.includes('tax')) {
      return TOPIC_IMAGES['news_economy'];
    }
    return TOPIC_IMAGES['news_general'];
  }

  if (category === 'sindh_board') {
    if (lowerSub.includes('physics') || lowerAngle.includes('physics')) {
      return TOPIC_IMAGES['sindh_board_physics'];
    }
    if (lowerSub.includes('chemistry') || lowerAngle.includes('chemistry')) {
      return TOPIC_IMAGES['sindh_board_chemistry'];
    }
    if (lowerSub.includes('biology') || lowerSub.includes('botany') || lowerSub.includes('zoology') || lowerAngle.includes('biology')) {
      return TOPIC_IMAGES['sindh_board_biology'];
    }
    if (lowerSub.includes('math') || lowerAngle.includes('math') || lowerAngle.includes('calculus')) {
      return TOPIC_IMAGES['sindh_board_math'];
    }
    if (lowerSub.includes('computer') || lowerAngle.includes('computer') || lowerAngle.includes('programming')) {
      return TOPIC_IMAGES['sindh_board_computer'];
    }
    if (lowerSub.includes('english') || lowerAngle.includes('english')) {
      return TOPIC_IMAGES['sindh_board_english'];
    }
    if (lowerSub.includes('urdu') || lowerSub.includes('sindhi') || lowerAngle.includes('urdu') || lowerAngle.includes('sindhi')) {
      return TOPIC_IMAGES['sindh_board_urdu'];
    }
    if (lowerSub.includes('pak') || lowerAngle.includes('pakistan')) {
      return TOPIC_IMAGES['sindh_board_pak_studies'];
    }
    if (lowerSub.includes('islam') || lowerAngle.includes('islamiat')) {
      return TOPIC_IMAGES['sindh_board_islamiat'];
    }
    if (lowerSub.includes('commerce') || lowerSub.includes('account') || lowerSub.includes('banking') || lowerSub.includes('economics')) {
      return TOPIC_IMAGES['sindh_board_commerce'];
    }
    if (lowerAngle.includes('class 1') || lowerAngle.includes('class 2') || lowerAngle.includes('class 3') || lowerAngle.includes('class 4') || lowerAngle.includes('class 5')) {
      return TOPIC_IMAGES['sindh_board_primary'];
    }
    return TOPIC_IMAGES['sindh_board_general'];
  }

  if (category === 'health') {
    if (lowerAngle.includes('sleep') || lowerAngle.includes('circadian')) {
      return TOPIC_IMAGES['health_sleep'];
    }
    if (lowerAngle.includes('nutrition') || lowerAngle.includes('diet') || lowerAngle.includes('food')) {
      return TOPIC_IMAGES['health_nutrition'];
    }
    if (lowerAngle.includes('gut') || lowerAngle.includes('microbiome') || lowerAngle.includes('digest')) {
      return TOPIC_IMAGES['health_gut'];
    }
    if (lowerAngle.includes('stress') || lowerAngle.includes('mental') || lowerAngle.includes('anxiety') || lowerAngle.includes('burnout')) {
      return TOPIC_IMAGES['health_mental'];
    }
    if (lowerAngle.includes('fatigue') || lowerAngle.includes('energy') || lowerAngle.includes('tired')) {
      return TOPIC_IMAGES['health_fatigue'];
    }
    if (lowerAngle.includes('immunity') || lowerAngle.includes('immune')) {
      return TOPIC_IMAGES['health_immunity'];
    }
    return TOPIC_IMAGES['health_habits'];
  }

  // Tech / Coding
  if (lowerAngle.includes('ai') || lowerAngle.includes('llm') || lowerAngle.includes('gpt')) {
    return TOPIC_IMAGES['tech_ai'];
  }
  if (lowerAngle.includes('cloud') || lowerAngle.includes('microservice') || lowerAngle.includes('docker')) {
    return TOPIC_IMAGES['tech_cloud'];
  }
  if (lowerAngle.includes('react') || lowerAngle.includes('typescript') || lowerAngle.includes('frontend')) {
    return TOPIC_IMAGES['tech_react'];
  }
  return TOPIC_IMAGES['tech_coding'];
}

/**
 * Creates clean HTML with featured image embedded for Blogger
 */
export function formatBloggerImageHtml(imageUrl: string, title: string, caption?: string): string {
  if (!imageUrl) return '';

  return `<div class="separator" style="clear: both; text-align: center; margin: 1.5rem 0 2rem 0;">
  <a href="${imageUrl}" style="margin-left: 1em; margin-right: 1em;" target="_blank">
    <img border="0" data-original-height="800" data-original-width="1200" src="${imageUrl}" alt="${title.replace(/"/g, '&quot;')}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.12); object-fit: cover; max-height: 480px; width: 100%;" />
  </a>
  ${caption ? `<p style="text-align: center; font-size: 0.85rem; color: #64748b; font-style: italic; margin-top: 0.5rem;">${caption}</p>` : ''}
</div>`;
}
