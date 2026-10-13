/**
 * Parse page/limit query params into skip/limit and build a paged response.
 */
export function getPagination(query, { defaultLimit = 12, maxLimit = 100 } = {}) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}

export function paged(res, { items, total, page, limit }, message = 'OK') {
  return res.json({
    success: true,
    message,
    data: items,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit) || 1,
    },
  });
}
