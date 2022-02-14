const { AbilityBuilder, createAliasResolver, makeAbilityFromRules } = require('feathers-casl');

// don't forget this, as `read` is used internally
const resolveAction = createAliasResolver({
  update: 'patch',       // define the same rules for update & patch
  read: ['get', 'find'], // use 'read' as a equivalent for 'get' & 'find'
  delete: 'remove'       // use 'delete' or 'remove'
});

const defineRulesFor = (user) => {
  // also see https://casl.js.org/v5/en/guide/define-rules
  const { can, cannot, rules } = new AbilityBuilder();

  if (user.role && user.role.name === 'SuperAdmin') {
    // SuperAdmin can do evil
    can('manage', 'all');
    return rules;
  }

  if (user.role && user.role.name === 'Admin') {
    can('create', 'users');
  }

  can('read', 'users');
  can('update', 'users', { id: user.id });
  cannot('update', 'users', ['roleId'], { id: user.id });
  cannot('delete', 'users', { id: user.id });

  can('manage', 'tasks', { userId: user.id });
  can('create-multi', 'posts', { userId: user.id })

  return rules;
};

const defineAbilitiesFor = (user) => {
  const rules = defineRulesFor(user);

  return makeAbilityFromRules(rules, { resolveAction });
};

module.exports = {
  defineRulesFor,
  defineAbilitiesFor
};
