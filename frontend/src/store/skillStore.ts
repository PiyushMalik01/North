import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Skill, SkillTree } from '@/types';

interface SkillState {
  currentSkill: Skill | null;
  skillTree: SkillTree | null;
  userSkills: Skill[];
  setCurrentSkill: (skill: Skill | null) => void;
  setSkillTree: (tree: SkillTree) => void;
  setUserSkills: (skills: Skill[]) => void;
  updateSkillStatus: (skillId: string, status: Skill['status']) => void;
}

export const useSkillStore = create<SkillState>()(
  devtools((set) => ({
    currentSkill: null,
    skillTree: null,
    userSkills: [],
    setCurrentSkill: (skill) => set({ currentSkill: skill }),
    setSkillTree: (tree) => set({ skillTree: tree }),
    setUserSkills: (skills) => set({ userSkills: skills }),
    updateSkillStatus: (skillId, status) =>
      set((state) => ({
        userSkills: state.userSkills.map((skill) =>
          skill.id === skillId ? { ...skill, status } : skill
        ),
      })),
  }))
);
