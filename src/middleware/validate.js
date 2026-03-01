export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.reduce((acc, issue) => {
      const field = issue.path.join('.') || 'unknown';
      if (!acc[field]) acc[field] = issue.message;
      return acc;
    }, {});

    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  req.validatedBody = result.data;
  next();
};
