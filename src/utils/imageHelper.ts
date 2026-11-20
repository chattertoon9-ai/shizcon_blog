/**
 * Curated high-resolution image mapper and formatter for Google Blogger posts.
 * Education only: Sindh Board subject images.
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
};

/**
 * Get an appropriate high-resolution image URL based on the Sindh Board
 * subject and topic. Always returns an education image.
 */
export function getFeaturedImageUrl(
  category: string,
  angle: string,
  sindhSubject?: string
): string {
  const lowerAngle = (angle || '').toLowerCase();
  const lowerSub = (sindhSubject || '').toLowerCase();

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
