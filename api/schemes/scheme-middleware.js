const Schemes = require('./scheme-model')
/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const { scheme_id } = req.params
  let sch = await Schemes.findSchemeId(scheme_id)
    if(!sch) return next({status: 404, message: `scheme with scheme_id ${scheme_id} not found`})
  next()
}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {
  const {scheme_name} = req.body;
  if(!scheme_name || typeof scheme_name !== 'string' || scheme_name.trim() === '') return next({status: 400, message: `invalid scheme_name`});
  req.body.scheme_name = scheme_name.trim();
  next()
}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {
  const { step_number, instructions } = req.body;
  if(
    step_number < 1 || typeof step_number !== 'number' ||
    !instructions || typeof instructions !== 'string' || instructions.trim() === ''
  ) return next({status: 400, message: 'invalid step'})
  next()
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
