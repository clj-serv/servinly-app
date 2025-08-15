// Type definitions for the responsibilities system
export type RoleFamily = "bar" | "service" | "frontdesk" | "coffee" | "kitchen" | "management";

export type RespItem = {
  id: string;
  label: string;
  tags: string[];
};

export type RespGroup = {
  id: string;
  title: string;
  items: RespItem[];
};

// Responsibilities library per role family with standardized categories
export const RESPONSIBILITIES: Record<RoleFamily, RespGroup[]> = {
  bar: [
    {
      id: "guest_service",
      title: "Guest Service",
      items: [
        {
          id: "welcome_guests",
          label: "Welcomed guests warmly and built rapport quickly",
          tags: ["people_person", "friendly", "guest_comms"],
        },
        {
          id: "handle_complaints",
          label: "Resolved guest complaints professionally and efficiently",
          tags: ["people_person", "problem_solver", "guest_comms"],
        },
        {
          id: "remember_preferences",
          label: "Remembered regular customers' drink preferences and names",
          tags: ["people_person", "detail_oriented", "guest_comms"],
        },
        {
          id: "upsell_drinks",
          label: "Suggested premium drinks and increased sales through recommendations",
          tags: ["people_person", "go_getter", "sales"],
        },
        {
          id: "vip_service",
          label: "Provided exceptional service to VIP guests and regular patrons",
          tags: ["people_person", "detail_oriented", "guest_comms"],
        },
      ],
    },
    {
      id: "teamwork_leadership",
      title: "Teamwork & Leadership",
      items: [
        {
          id: "train_staff",
          label: "Trained and mentored junior bartending staff",
          tags: ["natural_leader", "team_player", "leadership"],
        },
        {
          id: "coordinate_team",
          label: "Coordinated with barbacks and servers during busy periods",
          tags: ["natural_leader", "team_player", "rally_team"],
        },
        {
          id: "set_standards",
          label: "Set service standards and led by example",
          tags: ["natural_leader", "detail_oriented", "leadership"],
        },
        {
          id: "delegate_tasks",
          label: "Delegated tasks effectively to maintain service flow",
          tags: ["natural_leader", "team_player", "rally_team"],
        },
        {
          id: "team_motivation",
          label: "Motivated team members during high-pressure situations",
          tags: ["natural_leader", "energy_bringer", "rally_team"],
        },
      ],
    },
    {
      id: "operations_efficiency",
      title: "Operations & Efficiency",
      items: [
        {
          id: "manage_orders",
          label: "Managed drink orders efficiently during peak hours",
          tags: ["switch_efficiency_mode", "focused", "calm_organized"],
        },
        {
          id: "inventory_control",
          label: "Maintained accurate inventory and reduced waste",
          tags: ["detail_oriented", "focused", "ops_cost"],
        },
        {
          id: "batch_preparation",
          label: "Prepared garnishes and syrups in batches to save time",
          tags: ["switch_efficiency_mode", "detail_oriented", "efficiency"],
        },
        {
          id: "workflow_optimization",
          label: "Optimized bar workflow to handle high-volume service",
          tags: ["switch_efficiency_mode", "focused", "efficiency"],
        },
        {
          id: "cost_management",
          label: "Managed operational costs and reduced overhead expenses",
          tags: ["detail_oriented", "focused", "ops_cost"],
        },
      ],
    },
    {
      id: "creativity_innovation",
      title: "Creativity & Innovation",
      items: [
        {
          id: "design_cocktails",
          label: "Designed seasonal cocktail specials and signature drinks",
          tags: ["creative", "energy_bringer", "detail_oriented"],
        },
        {
          id: "menu_development",
          label: "Developed new menu items based on customer feedback",
          tags: ["creative", "people_person", "go_getter"],
        },
        {
          id: "presentation_skills",
          label: "Created visually appealing drink presentations",
          tags: ["creative", "detail_oriented", "focused"],
        },
        {
          id: "trend_adaptation",
          label: "Adapted to industry trends and customer preferences",
          tags: ["creative", "energy_bringer", "go_getter"],
        },
        {
          id: "recipe_innovation",
          label: "Innovated new recipes and flavor combinations",
          tags: ["creative", "detail_oriented", "problem_solver"],
        },
      ],
    },
    {
      id: "quality_compliance",
      title: "Quality & Compliance",
      items: [
        {
          id: "safety_standards",
          label: "Followed licensing and safety standards consistently",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "hygiene_practices",
          label: "Maintained strict hygiene and cleanliness standards",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "quality_control",
          label: "Ensured all drinks met quality standards before serving",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "compliance_monitoring",
          label: "Monitored and maintained compliance with all regulations",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "audit_preparation",
          label: "Prepared for health and safety audits with proper documentation",
          tags: ["detail_oriented", "focused", "quality"],
        },
      ],
    },
  ],
  service: [
    {
      id: "guest_service",
      title: "Guest Service",
      items: [
        {
          id: "welcome_guests",
          label: "Greeted guests warmly and created welcoming atmosphere",
          tags: ["people_person", "friendly", "guest_comms"],
        },
        {
          id: "handle_requests",
          label: "Handled special dietary requests and accommodations",
          tags: ["people_person", "problem_solver", "guest_comms"],
        },
        {
          id: "build_rapport",
          label: "Built relationships with regular customers",
          tags: ["people_person", "friendly", "guest_comms"],
        },
        {
          id: "anticipate_needs",
          label: "Anticipated guest needs and provided proactive service",
          tags: ["people_person", "focused", "guest_comms"],
        },
        {
          id: "upsell_techniques",
          label: "Used upselling techniques to increase table sales",
          tags: ["go_getter", "people_person", "sales"],
        },
      ],
    },
    {
      id: "teamwork_leadership",
      title: "Teamwork & Leadership",
      items: [
        {
          id: "coordinate_kitchen",
          label: "Coordinated with kitchen staff for smooth service",
          tags: ["team_player", "rally_team", "focused"],
        },
        {
          id: "support_colleagues",
          label: "Supported colleagues during busy periods",
          tags: ["team_player", "rally_team", "friendly"],
        },
        {
          id: "communicate_orders",
          label: "Communicated orders clearly to kitchen team",
          tags: ["team_player", "focused", "guest_comms"],
        },
        {
          id: "section_management",
          label: "Managed multiple tables efficiently in assigned section",
          tags: ["team_player", "focused", "efficiency"],
        },
        {
          id: "mentor_juniors",
          label: "Mentored junior staff and shared best practices",
          tags: ["natural_leader", "team_player", "leadership"],
        },
      ],
    },
    {
      id: "operations_efficiency",
      title: "Operations & Efficiency",
      items: [
        {
          id: "manage_sections",
          label: "Managed multiple tables efficiently during peak hours",
          tags: ["switch_efficiency_mode", "focused", "calm_organized"],
        },
        {
          id: "time_management",
          label: "Balanced multiple tasks and maintained service pace",
          tags: ["switch_efficiency_mode", "focused", "efficiency"],
        },
        {
          id: "workflow_optimization",
          label: "Optimized service workflow to reduce wait times",
          tags: ["switch_efficiency_mode", "focused", "efficiency"],
        },
        {
          id: "table_turnover",
          label: "Maximized table turnover while maintaining service quality",
          tags: ["switch_efficiency_mode", "focused", "ops_cost"],
        },
        {
          id: "reservation_management",
          label: "Managed reservations and optimized seating arrangements",
          tags: ["detail_oriented", "focused", "efficiency"],
        },
      ],
    },
    {
      id: "creativity_innovation",
      title: "Creativity & Innovation",
      items: [
        {
          id: "service_improvements",
          label: "Developed innovative service techniques and procedures",
          tags: ["creative", "go_getter", "problem_solver"],
        },
        {
          id: "guest_experience",
          label: "Created memorable guest experiences through personal touches",
          tags: ["creative", "people_person", "energy_bringer"],
        },
        {
          id: "problem_solving",
          label: "Solved unique guest challenges with creative solutions",
          tags: ["creative", "problem_solver", "guest_comms"],
        },
        {
          id: "service_adaptation",
          label: "Adapted service style to different guest preferences",
          tags: ["creative", "people_person", "focused"],
        },
        {
          id: "feedback_implementation",
          label: "Implemented guest feedback to improve service delivery",
          tags: ["creative", "detail_oriented", "go_getter"],
        },
      ],
    },
    {
      id: "quality_compliance",
      title: "Quality & Compliance",
      items: [
        {
          id: "service_standards",
          label: "Maintained consistent service quality across all interactions",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "safety_protocols",
          label: "Followed food safety protocols and hygiene standards",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "compliance_training",
          label: "Stayed updated on industry regulations and compliance requirements",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "quality_monitoring",
          label: "Monitored service quality and addressed issues promptly",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "documentation_maintenance",
          label: "Maintained accurate records of guest interactions and issues",
          tags: ["detail_oriented", "focused", "quality"],
        },
      ],
    },
  ],
  frontdesk: [
    {
      id: "guest_service",
      title: "Guest Service",
      items: [
        {
          id: "check_in_guests",
          label: "Processed check-ins efficiently during arrival waves",
          tags: ["people_person", "focused", "guest_comms"],
        },
        {
          id: "handle_requests",
          label: "Handled guest requests and special accommodations",
          tags: ["people_person", "problem_solver", "guest_comms"],
        },
        {
          id: "resolve_issues",
          label: "Resolved guest issues and complaints professionally",
          tags: ["people_person", "problem_solver", "guest_comms"],
        },
        {
          id: "provide_information",
          label: "Provided local information and recommendations",
          tags: ["people_person", "friendly", "guest_comms"],
        },
        {
          id: "vip_experience",
          label: "Created exceptional experiences for VIP guests",
          tags: ["people_person", "detail_oriented", "guest_comms"],
        },
      ],
    },
    {
      id: "teamwork_leadership",
      title: "Teamwork & Leadership",
      items: [
        {
          id: "coordinate_housekeeping",
          label: "Coordinated with housekeeping for room readiness",
          tags: ["team_player", "rally_team", "focused"],
        },
        {
          id: "support_colleagues",
          label: "Supported colleagues during busy periods",
          tags: ["team_player", "rally_team", "friendly"],
        },
        {
          id: "team_communication",
          label: "Maintained clear communication with all departments",
          tags: ["team_player", "focused", "guest_comms"],
        },
        {
          id: "mentor_staff",
          label: "Mentored new staff members and shared knowledge",
          tags: ["natural_leader", "team_player", "leadership"],
        },
        {
          id: "team_coordination",
          label: "Coordinated cross-departmental activities effectively",
          tags: ["natural_leader", "team_player", "rally_team"],
        },
      ],
    },
    {
      id: "operations_efficiency",
      title: "Operations & Efficiency",
      items: [
        {
          id: "manage_bookings",
          label: "Managed bookings and optimized room allocation",
          tags: ["detail_oriented", "focused", "efficiency"],
        },
        {
          id: "inventory_control",
          label: "Maintained accurate room inventory and status",
          tags: ["detail_oriented", "focused", "ops_cost"],
        },
        {
          id: "workflow_optimization",
          label: "Optimized front desk operations for efficiency",
          tags: ["switch_efficiency_mode", "focused", "efficiency"],
        },
        {
          id: "system_management",
          label: "Managed property management systems effectively",
          tags: ["detail_oriented", "focused", "efficiency"],
        },
        {
          id: "report_generation",
          label: "Generated daily reports and occupancy statistics",
          tags: ["detail_oriented", "focused", "ops_cost"],
        },
      ],
    },
    {
      id: "creativity_innovation",
      title: "Creativity & Innovation",
      items: [
        {
          id: "guest_experience",
          label: "Developed innovative guest experience initiatives",
          tags: ["creative", "people_person", "go_getter"],
        },
        {
          id: "process_improvement",
          label: "Identified and implemented process improvements",
          tags: ["creative", "problem_solver", "efficiency"],
        },
        {
          id: "service_innovation",
          label: "Created new service offerings for guests",
          tags: ["creative", "go_getter", "energy_bringer"],
        },
        {
          id: "problem_solving",
          label: "Solved complex guest challenges creatively",
          tags: ["creative", "problem_solver", "guest_comms"],
        },
        {
          id: "feedback_implementation",
          label: "Implemented guest feedback to enhance services",
          tags: ["creative", "detail_oriented", "go_getter"],
        },
      ],
    },
    {
      id: "quality_compliance",
      title: "Quality & Compliance",
      items: [
        {
          id: "service_standards",
          label: "Maintained consistent service quality standards",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "compliance_monitoring",
          label: "Ensured compliance with hospitality regulations",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "quality_assurance",
          label: "Implemented quality assurance procedures",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "audit_preparation",
          label: "Prepared for regulatory audits and inspections",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "documentation_standards",
          label: "Maintained accurate documentation and records",
          tags: ["detail_oriented", "focused", "quality"],
        },
      ],
    },
  ],
  coffee: [
    {
      id: "guest_service",
      title: "Guest Service",
      items: [
        {
          id: "welcome_customers",
          label: "Greeted customers and fostered a welcoming counter environment",
          tags: ["people_person", "friendly", "guest_comms"],
        },
        {
          id: "build_rapport",
          label: "Built rapport with regular customers and remembered preferences",
          tags: ["people_person", "friendly", "guest_comms"],
        },
        {
          id: "handle_requests",
          label: "Handled special requests and dietary requirements professionally",
          tags: ["people_person", "friendly", "guest_comms"],
        },
        {
          id: "resolve_issues",
          label: "Resolved customer concerns and complaints effectively",
          tags: ["people_person", "problem_solver", "guest_comms"],
        },
        {
          id: "upsell_products",
          label: "Suggested additional products and increased sales",
          tags: ["go_getter", "people_person", "sales"],
        },
      ],
    },
    {
      id: "teamwork_leadership",
      title: "Teamwork & Leadership",
      items: [
        {
          id: "coordinate_orders",
          label: "Coordinated with kitchen staff for food orders",
          tags: ["team_player", "rally_team", "focused"],
        },
        {
          id: "support_colleagues",
          label: "Supported colleagues during busy periods",
          tags: ["team_player", "rally_team", "friendly"],
        },
        {
          id: "communicate_status",
          label: "Communicated order status and timing clearly",
          tags: ["team_player", "focused", "guest_comms"],
        },
        {
          id: "mentor_juniors",
          label: "Trained and mentored new barista staff",
          tags: ["natural_leader", "team_player", "leadership"],
        },
        {
          id: "team_coordination",
          label: "Coordinated team activities during peak hours",
          tags: ["natural_leader", "team_player", "rally_team"],
        },
      ],
    },
    {
      id: "operations_efficiency",
      title: "Operations & Efficiency",
      items: [
        {
          id: "manage_queue",
          label: "Managed customer queue efficiently during peak periods",
          tags: ["switch_efficiency_mode", "focused", "efficiency"],
        },
        {
          id: "batch_preparation",
          label: "Prepared multiple orders simultaneously to reduce wait times",
          tags: ["switch_efficiency_mode", "focused", "efficiency"],
        },
        {
          id: "inventory_management",
          label: "Monitored and restocked coffee beans and supplies",
          tags: ["detail_oriented", "focused", "ops_cost"],
        },
        {
          id: "equipment_maintenance",
          label: "Maintained coffee machines and equipment cleanliness",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "workflow_optimization",
          label: "Optimized coffee preparation workflow for efficiency",
          tags: ["switch_efficiency_mode", "focused", "efficiency"],
        },
      ],
    },
    {
      id: "creativity_innovation",
      title: "Creativity & Innovation",
      items: [
        {
          id: "coffee_art",
          label: "Created beautiful latte art and drink presentations",
          tags: ["creative", "detail_oriented", "energy_bringer"],
        },
        {
          id: "recipe_development",
          label: "Developed new coffee recipes and flavor combinations",
          tags: ["creative", "detail_oriented", "problem_solver"],
        },
        {
          id: "menu_innovation",
          label: "Innovated seasonal menu items and specials",
          tags: ["creative", "go_getter", "energy_bringer"],
        },
        {
          id: "customer_experience",
          label: "Created unique customer experiences through personal touches",
          tags: ["creative", "people_person", "energy_bringer"],
        },
        {
          id: "process_improvement",
          label: "Identified and implemented process improvements",
          tags: ["creative", "problem_solver", "efficiency"],
        },
      ],
    },
    {
      id: "quality_compliance",
      title: "Quality & Compliance",
      items: [
        {
          id: "maintain_standards",
          label: "Maintained consistent coffee quality and presentation standards",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "dial_in_shots",
          label: "Dialed in espresso shots for optimal flavor and consistency",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "milk_texturing",
          label: "Created perfect milk texture for lattes and cappuccinos",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "recipe_consistency",
          label: "Followed recipes precisely for all specialty drinks",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "hygiene_practices",
          label: "Maintained strict hygiene and food safety standards",
          tags: ["detail_oriented", "focused", "quality"],
        },
      ],
    },
  ],
  kitchen: [
    {
      id: "guest_service",
      title: "Guest Service",
      items: [
        {
          id: "dietary_accommodations",
          label: "Accommodated special dietary requests and restrictions",
          tags: ["people_person", "detail_oriented", "guest_comms"],
        },
        {
          id: "allergen_management",
          label: "Managed allergen information and cross-contamination prevention",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "guest_communication",
          label: "Communicated with front-of-house staff about guest needs",
          tags: ["team_player", "focused", "guest_comms"],
        },
        {
          id: "special_requests",
          label: "Handled special cooking requests and modifications",
          tags: ["people_person", "problem_solver", "guest_comms"],
        },
        {
          id: "quality_standards",
          label: "Ensured all dishes met guest expectations and standards",
          tags: ["detail_oriented", "focused", "quality"],
        },
      ],
    },
    {
      id: "teamwork_leadership",
      title: "Teamwork & Leadership",
      items: [
        {
          id: "coordinate_foh",
          label: "Coordinated with front-of-house staff for timing",
          tags: ["team_player", "rally_team", "focused"],
        },
        {
          id: "support_colleagues",
          label: "Supported colleagues during busy periods",
          tags: ["team_player", "rally_team", "friendly"],
        },
        {
          id: "communicate_status",
          label: "Communicated order status and timing clearly",
          tags: ["team_player", "focused", "guest_comms"],
        },
        {
          id: "mentor_juniors",
          label: "Trained and mentored junior kitchen staff",
          tags: ["natural_leader", "team_player", "leadership"],
        },
        {
          id: "team_coordination",
          label: "Coordinated kitchen team activities effectively",
          tags: ["natural_leader", "team_player", "rally_team"],
        },
      ],
    },
    {
      id: "operations_efficiency",
      title: "Operations & Efficiency",
      items: [
        {
          id: "maintain_standards",
          label: "Maintained food quality and presentation standards",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "efficient_cooking",
          label: "Cooked multiple orders efficiently during peak service",
          tags: ["switch_efficiency_mode", "focused", "efficiency"],
        },
        {
          id: "recipe_consistency",
          label: "Ensured consistent recipe execution and plating",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "inventory_control",
          label: "Managed food inventory and reduced waste",
          tags: ["detail_oriented", "focused", "ops_cost"],
        },
        {
          id: "workflow_optimization",
          label: "Optimized kitchen workflow for maximum efficiency",
          tags: ["switch_efficiency_mode", "focused", "efficiency"],
        },
      ],
    },
    {
      id: "creativity_innovation",
      title: "Creativity & Innovation",
      items: [
        {
          id: "recipe_development",
          label: "Developed new recipes and menu items",
          tags: ["creative", "detail_oriented", "problem_solver"],
        },
        {
          id: "presentation_skills",
          label: "Created visually appealing food presentations",
          tags: ["creative", "detail_oriented", "energy_bringer"],
        },
        {
          id: "flavor_innovation",
          label: "Innovated new flavor combinations and techniques",
          tags: ["creative", "detail_oriented", "problem_solver"],
        },
        {
          id: "menu_creativity",
          label: "Contributed creative ideas to menu development",
          tags: ["creative", "go_getter", "energy_bringer"],
        },
        {
          id: "problem_solving",
          label: "Solved cooking challenges with creative solutions",
          tags: ["creative", "problem_solver", "efficiency"],
        },
      ],
    },
    {
      id: "quality_compliance",
      title: "Quality & Compliance",
      items: [
        {
          id: "food_safety",
          label: "Maintained strict food safety and hygiene standards",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "temperature_control",
          label: "Monitored and maintained proper food temperatures",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "cross_contamination",
          label: "Prevented cross-contamination and allergen exposure",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "compliance_monitoring",
          label: "Ensured compliance with health and safety regulations",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "quality_control",
          label: "Implemented quality control procedures consistently",
          tags: ["detail_oriented", "focused", "quality"],
        },
      ],
    },
  ],
  management: [
    {
      id: "guest_service",
      title: "Guest Service",
      items: [
        {
          id: "vip_management",
          label: "Managed VIP guest relationships and experiences",
          tags: ["people_person", "detail_oriented", "guest_comms"],
        },
        {
          id: "guest_satisfaction",
          label: "Monitored and improved guest satisfaction scores",
          tags: ["people_person", "focused", "guest_comms"],
        },
        {
          id: "complaint_resolution",
          label: "Resolved escalated guest complaints and issues",
          tags: ["people_person", "problem_solver", "guest_comms"],
        },
        {
          id: "guest_experience",
          label: "Developed and implemented guest experience strategies",
          tags: ["people_person", "creative", "go_getter"],
        },
        {
          id: "feedback_management",
          label: "Managed guest feedback and implemented improvements",
          tags: ["people_person", "detail_oriented", "go_getter"],
        },
      ],
    },
    {
      id: "teamwork_leadership",
      title: "Teamwork & Leadership",
      items: [
        {
          id: "manage_staff",
          label: "Managed and motivated team of hospitality professionals",
          tags: ["natural_leader", "team_player", "leadership"],
        },
        {
          id: "set_standards",
          label: "Set service standards and led by example",
          tags: ["natural_leader", "detail_oriented", "leadership"],
        },
        {
          id: "train_develop",
          label: "Trained and developed staff for career growth",
          tags: ["natural_leader", "team_player", "leadership"],
        },
        {
          id: "performance_management",
          label: "Managed staff performance and provided feedback",
          tags: ["natural_leader", "detail_oriented", "leadership"],
        },
        {
          id: "team_building",
          label: "Built cohesive teams and fostered positive culture",
          tags: ["natural_leader", "team_player", "energy_bringer"],
        },
      ],
    },
    {
      id: "operations_efficiency",
      title: "Operations & Efficiency",
      items: [
        {
          id: "optimize_processes",
          label: "Optimized operational processes for efficiency",
          tags: ["switch_efficiency_mode", "focused", "efficiency"],
        },
        {
          id: "cost_control",
          label: "Managed operational costs and budgets effectively",
          tags: ["detail_oriented", "focused", "ops_cost"],
        },
        {
          id: "quality_assurance",
          label: "Ensured consistent quality across all operations",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "compliance_management",
          label: "Maintained compliance with all regulations and standards",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "workflow_optimization",
          label: "Streamlined workflows and improved productivity",
          tags: ["switch_efficiency_mode", "focused", "efficiency"],
        },
      ],
    },
    {
      id: "creativity_innovation",
      title: "Creativity & Innovation",
      items: [
        {
          id: "strategic_planning",
          label: "Developed strategic plans for business growth",
          tags: ["creative", "detail_oriented", "go_getter"],
        },
        {
          id: "process_innovation",
          label: "Innovated new processes and procedures",
          tags: ["creative", "problem_solver", "efficiency"],
        },
        {
          id: "service_development",
          label: "Developed new service offerings and programs",
          tags: ["creative", "go_getter", "energy_bringer"],
        },
        {
          id: "market_adaptation",
          label: "Adapted services to changing market conditions",
          tags: ["creative", "problem_solver", "go_getter"],
        },
        {
          id: "continuous_improvement",
          label: "Implemented continuous improvement initiatives",
          tags: ["creative", "detail_oriented", "go_getter"],
        },
      ],
    },
    {
      id: "quality_compliance",
      title: "Quality & Compliance",
      items: [
        {
          id: "quality_standards",
          label: "Established and maintained quality standards",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "compliance_frameworks",
          label: "Developed and maintained compliance frameworks",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "audit_management",
          label: "Managed internal and external audits",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "risk_management",
          label: "Identified and mitigated operational risks",
          tags: ["detail_oriented", "focused", "quality"],
        },
        {
          id: "documentation_standards",
          label: "Maintained comprehensive documentation standards",
          tags: ["detail_oriented", "focused", "quality"],
        },
      ],
    },
  ],
};
