import { supabase } from '../lib/supabase';
import { Meal } from '../types/meal';

export const saveMeal = async (meal: Omit<Meal, 'id' | 'created_at'>) => {
  try {
    const { data, error } = await supabase
      .from('meals')
      .insert([meal])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving meal:', error);
    throw error;
  }
};

export const getMeals = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};
