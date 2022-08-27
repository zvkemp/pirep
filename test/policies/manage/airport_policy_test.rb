require 'policy_test'

module Manage
  class AirportPolicyTest < PolicyTest
    ['index', 'show', 'edit', 'update'].each do |action|
      test action do
        assert_allows_admin :manage_airport, action
      end
    end
  end
end
