
-- Check if policies exist and create only missing ones
-- For expenses table
DO $$
BEGIN
    -- Check and create SELECT policy for expenses
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'expenses' 
        AND policyname = 'Users can view their own expenses'
    ) THEN
        CREATE POLICY "Users can view their own expenses" 
        ON public.expenses 
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    -- Check and create INSERT policy for expenses
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'expenses' 
        AND policyname = 'Users can create their own expenses'
    ) THEN
        CREATE POLICY "Users can create their own expenses" 
        ON public.expenses 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Check and create UPDATE policy for expenses
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'expenses' 
        AND policyname = 'Users can update their own expenses'
    ) THEN
        CREATE POLICY "Users can update their own expenses" 
        ON public.expenses 
        FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;

    -- Check and create DELETE policy for expenses
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'expenses' 
        AND policyname = 'Users can delete their own expenses'
    ) THEN
        CREATE POLICY "Users can delete their own expenses" 
        ON public.expenses 
        FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- For budgets table
DO $$
BEGIN
    -- Check and create SELECT policy for budgets
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'budgets' 
        AND policyname = 'Users can view their own budgets'
    ) THEN
        CREATE POLICY "Users can view their own budgets" 
        ON public.budgets 
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    -- Check and create INSERT policy for budgets
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'budgets' 
        AND policyname = 'Users can create their own budgets'
    ) THEN
        CREATE POLICY "Users can create their own budgets" 
        ON public.budgets 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Check and create UPDATE policy for budgets
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'budgets' 
        AND policyname = 'Users can update their own budgets'
    ) THEN
        CREATE POLICY "Users can update their own budgets" 
        ON public.budgets 
        FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;

    -- Check and create DELETE policy for budgets
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'budgets' 
        AND policyname = 'Users can delete their own budgets'
    ) THEN
        CREATE POLICY "Users can delete their own budgets" 
        ON public.budgets 
        FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- For profiles table
DO $$
BEGIN
    -- Check and create SELECT policy for profiles
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can view their own profile'
    ) THEN
        CREATE POLICY "Users can view their own profile" 
        ON public.profiles 
        FOR SELECT 
        USING (auth.uid() = id);
    END IF;

    -- Check and create UPDATE policy for profiles
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can update their own profile'
    ) THEN
        CREATE POLICY "Users can update their own profile" 
        ON public.profiles 
        FOR UPDATE 
        USING (auth.uid() = id);
    END IF;

    -- Check and create INSERT policy for profiles
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can insert their own profile'
    ) THEN
        CREATE POLICY "Users can insert their own profile" 
        ON public.profiles 
        FOR INSERT 
        WITH CHECK (auth.uid() = id);
    END IF;
END $$;
